import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { GoogleGenAI } from '@google/genai';
import { db } from './src/lib/db';
import { INITIAL_QUESTION_BANK } from './src/data/initialQuestionBank';
import { NEET_SYLLABUS } from './src/data/syllabus';
import { Question, SubjectName, TestResultSummary } from './src/types/neetbuddy';
import {
  getSupabaseBackendClient,
  getSupabaseStats,
  saveSupabaseConfig,
  seedQuestionsToSupabase,
  getQuestionsFromSupabase,
  addQuestionToSupabase,
  recordTestAttemptToSupabase,
  testSupabaseConnection
} from './src/lib/supabaseBackend';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024 } });

async function createServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(cors());
  app.use(express.json({ limit: '10mb' }));

  // Initialize Gemini AI Client
  const apiKey = process.env.GEMINI_API_KEY;
  const aiClient = apiKey ? new GoogleGenAI({ apiKey }) : null;

  // --- API ROUTES ---

  // 0. Supabase Backend Management & Integration Endpoints
  app.get('/api/supabase/status', async (_req: Request, res: Response) => {
    try {
      const stats = await getSupabaseStats();
      return res.json(stats);
    } catch (err: any) {
      return res.status(500).json({ error: err?.message || 'Failed to check Supabase status' });
    }
  });

  app.post('/api/supabase/config', async (req: Request, res: Response) => {
    const { url, key } = req.body;
    if (!url || !key) {
      return res.status(400).json({ error: 'Both Supabase URL and API Key are required.' });
    }

    try {
      const saved = saveSupabaseConfig(url, key);
      const test = await testSupabaseConnection();
      return res.json({
        success: true,
        saved: true,
        connected: test.connected,
        latencyMs: test.latencyMs,
        error: test.error,
        url: saved.url
      });
    } catch (err: any) {
      return res.status(500).json({ error: err?.message || 'Failed to save Supabase configuration' });
    }
  });

  app.post('/api/supabase/seed', async (_req: Request, res: Response) => {
    try {
      const result = await seedQuestionsToSupabase();
      return res.json(result);
    } catch (err: any) {
      return res.status(500).json({ error: err?.message || 'Failed to seed questions to Supabase' });
    }
  });

  app.get('/api/supabase/schema-sql', (_req: Request, res: Response) => {
    try {
      const schemaPath = path.resolve(process.cwd(), 'supabase/migrations/20261103000000_neetbuddy_master_schema.sql');
      if (fs.existsSync(schemaPath)) {
        const sql = fs.readFileSync(schemaPath, 'utf-8');
        return res.json({ sql, filename: '20261103000000_neetbuddy_master_schema.sql' });
      }
      return res.status(404).json({ error: 'Master SQL schema migration file not found.' });
    } catch (err: any) {
      return res.status(500).json({ error: err?.message || 'Failed to read schema SQL' });
    }
  });

  // 1. Auth Endpoints
  app.post('/api/auth/register', async (req: Request, res: Response) => {
    const { fullName, email, phone, targetYear, classLevel, password } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields: fullName, email, password' });
    }

    const existing = db.getUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email address already exists.' });
    }

    const newUser = db.addUser({
      id: 'usr-' + Date.now(),
      fullName,
      email: email.toLowerCase().trim(),
      phone: phone || '',
      targetYear: Number(targetYear) || 2026,
      classLevel: classLevel || 'Class 12',
      role: email.toLowerCase().includes('admin') ? 'admin' : 'student',
      createdAt: new Date().toISOString()
    });

    // Sync to Supabase profiles table if Supabase is connected
    const sbClient = getSupabaseBackendClient();
    if (sbClient) {
      try {
        await sbClient.from('profiles').upsert({
          full_name: newUser.fullName,
          email: newUser.email,
          phone: newUser.phone,
          target_year: newUser.targetYear,
          class_level: newUser.classLevel
        }, { onConflict: 'email' });
      } catch (e) {
        console.warn('Could not sync profile to Supabase:', e);
      }
    }

    db.logAudit(newUser.email, 'USER_REGISTER', 'USER', `Registered user ${newUser.fullName} (${newUser.role})`);
    return res.json({ user: newUser, token: 'mock-jwt-' + newUser.id });
  });

  app.post('/api/auth/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Please enter email/phone and password.' });
    }

    let user = db.getUserByEmail(email);

    // If not in local db, check Supabase profiles
    const sbClient = getSupabaseBackendClient();
    if (!user && sbClient) {
      try {
        const { data } = await sbClient.from('profiles').select('*').eq('email', email.toLowerCase().trim()).single();
        if (data) {
          user = db.addUser({
            id: data.id || 'usr-' + Date.now(),
            fullName: data.full_name || email.split('@')[0],
            email: data.email,
            phone: data.phone || '',
            targetYear: data.target_year || 2026,
            classLevel: data.class_level || 'Class 12',
            role: email.toLowerCase().includes('admin') ? 'admin' : 'student',
            createdAt: data.created_at || new Date().toISOString()
          });
        }
      } catch (e) {}
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials. No user found with this email.' });
    }

    db.logAudit(user.email, 'USER_LOGIN', 'USER', `User logged in: ${user.email}`);
    return res.json({ user, token: 'mock-jwt-' + user.id });
  });

  // 2. Syllabus Endpoint
  app.get('/api/syllabus', (_req: Request, res: Response) => {
    return res.json({ syllabus: NEET_SYLLABUS });
  });

  // 3. Questions API (Powered by Supabase with Local Fallback)
  app.get('/api/questions', async (req: Request, res: Response) => {
    const { subject, chapter, topic, search, limit = '50', page = '1' } = req.query;
    const lim = Math.min(100, Number(limit) || 50);
    const pg = Math.max(1, Number(page) || 1);

    try {
      const result = await getQuestionsFromSupabase({
        subject: typeof subject === 'string' ? subject : undefined,
        chapter: typeof chapter === 'string' ? chapter : undefined,
        topic: typeof topic === 'string' ? topic : undefined,
        search: typeof search === 'string' ? search : undefined,
        limit: lim,
        page: pg
      });

      return res.json({
        questions: result.questions,
        total: result.total,
        page: pg,
        totalPages: Math.ceil(result.total / lim),
        source: result.source
      });
    } catch (err: any) {
      console.error('Error fetching questions:', err);
      return res.status(500).json({ error: 'Failed to retrieve questions.' });
    }
  });

  app.post('/api/questions', async (req: Request, res: Response) => {
    const { subject, chapter, topic, statement, options, correctOptionIndex, explanation, difficulty, ncertReference } = req.body;
    if (!subject || !chapter || !statement || !options || correctOptionIndex === undefined) {
      return res.status(400).json({ error: 'Missing required question fields.' });
    }

    const newQuestion: Question = {
      id: 'q-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      subject: subject as SubjectName,
      chapter,
      topic: topic || 'General',
      statement,
      options: Array.isArray(options) ? options : [options.a, options.b, options.c, options.d],
      correctOptionIndex: Number(correctOptionIndex),
      explanation: explanation || 'Refer to NCERT textbook for detailed derivation.',
      difficulty: difficulty || 'Medium',
      marks: 4,
      negativeMarks: 1,
      ncertReference,
      status: 'published',
      createdAt: new Date().toISOString()
    };

    const saved = await addQuestionToSupabase(newQuestion);
    db.logAudit('admin@neetbuddy.com', 'CREATE_QUESTION', 'QUESTION', `Created question in ${subject} -> ${chapter}`);
    return res.status(201).json({ question: saved });
  });

  app.put('/api/questions/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    const updated = db.updateQuestion(id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Question not found.' });
    }
    db.logAudit('admin@neetbuddy.com', 'UPDATE_QUESTION', 'QUESTION', `Updated question ID: ${id}`);
    return res.json({ question: updated });
  });

  app.delete('/api/questions/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    db.deleteQuestion(id);
    db.logAudit('admin@neetbuddy.com', 'DELETE_QUESTION', 'QUESTION', `Deleted question ID: ${id}`);
    return res.json({ success: true, id });
  });

  // 4. PDF Ingestion & Automated Extraction Pipeline
  app.post('/api/admin/parse-pdf', upload.single('file'), async (req: Request, res: Response) => {
    try {
      const subject = (req.body.subject || 'Physics') as SubjectName;
      const chapter = req.body.chapter || 'General Chapter';
      let extractedText = req.body.rawText || '';

      // If file uploaded, attempt parsing text buffer
      if (req.file) {
        extractedText = req.file.buffer.toString('utf-8');
      }

      if (!extractedText || extractedText.trim().length < 20) {
        // Fallback sample parsed questions if demo text provided
        extractedText = `
Q1. What is the SI unit of luminous intensity?
(A) Lumen
(B) Candela
(C) Lux
(D) Watt
Answer: B
Explanation: Candela is the SI base unit of luminous intensity.

Q2. Acceleration due to gravity on the surface of the Earth is approximately:
(A) 9.8 m/s²
(B) 11.2 m/s²
(C) 3.0 m/s²
(D) 1.6 m/s²
Answer: A
Explanation: Standard acceleration due to gravity g = 9.8 m/s².
        `;
      }

      // Parse question blocks using Regex Pattern Ingestion
      const qBlocks = extractedText.split(/(?:Q\d+[\.\:]|Question\s*\d+[\.\:]|\n(?=[1-9]\d*[\.\:]\s))/i).filter((b: string) => b.trim().length > 15);
      const parsedQuestions: Question[] = [];

      for (let idx = 0; idx < qBlocks.length; idx++) {
        const block = qBlocks[idx].trim();
        const lines = block.split('\n').map((l: string) => l.trim()).filter(Boolean);
        const statement = lines[0] || 'Sample Question Statement';

        // Extract options A, B, C, D
        const optionsMatch = block.match(/\([A-D]\)\s*([^\n\(\)]+)/gi);
        let options = ['Option A', 'Option B', 'Option C', 'Option D'];
        if (optionsMatch && optionsMatch.length >= 4) {
          options = optionsMatch.slice(0, 4).map((o: string) => o.replace(/\([A-D]\)\s*/i, '').trim());
        }

        // Extract answer key
        const ansMatch = block.match(/Ans(?:wer)?\s*[\:\=]\s*([A-D])/i);
        let correctOptionIndex = 0;
        if (ansMatch) {
          const letter = ansMatch[1].toUpperCase();
          correctOptionIndex = ['A', 'B', 'C', 'D'].indexOf(letter);
          if (correctOptionIndex === -1) correctOptionIndex = 0;
        }

        // Extract explanation
        const expMatch = block.match(/Exp(?:lanation)?\s*[\:\=]\s*(.+)/i);
        const explanation = expMatch ? expMatch[1].trim() : 'Extracted from uploaded document.';

        // Check duplicates against database
        const isDuplicate = db.getQuestions().some(existing =>
          existing.statement.toLowerCase().replace(/\s+/g, '') === statement.toLowerCase().replace(/\s+/g, '')
        );

        if (!isDuplicate) {
          const q: Question = {
            id: 'q-pdf-' + Date.now() + '-' + idx,
            subject,
            chapter,
            topic: 'Imported Topic',
            statement,
            options,
            correctOptionIndex,
            explanation,
            difficulty: 'Medium',
            status: 'published',
            createdAt: new Date().toISOString()
          };
          parsedQuestions.push(q);
          db.addQuestion(q);
        }
      }

      const batch = db.addImportBatch({
        id: 'batch-' + Date.now(),
        filename: req.file ? req.file.originalname : 'Direct Text Import',
        totalDetected: qBlocks.length,
        approvedCount: parsedQuestions.length,
        rejectedCount: qBlocks.length - parsedQuestions.length,
        status: 'completed',
        extractedQuestions: parsedQuestions,
        createdAt: new Date().toISOString()
      });

      db.logAudit('admin@neetbuddy.com', 'PDF_IMPORT', 'IMPORT_BATCH', `Imported ${parsedQuestions.length} questions into ${subject}`);

      return res.json({
        success: true,
        batch,
        importedCount: parsedQuestions.length,
        duplicateCount: qBlocks.length - parsedQuestions.length
      });
    } catch (err) {
      console.error('PDF parsing error:', err);
      return res.status(500).json({ error: 'Failed to parse PDF document.' });
    }
  });

  // 5. Test Submission & Server-side Auto Grading
  app.post('/api/tests/submit', async (req: Request, res: Response) => {
    const { testName, type, questions, userAnswers, durationSeconds } = req.body;
    if (!questions || !userAnswers) {
      return res.status(400).json({ error: 'Missing questions or userAnswers.' });
    }

    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;
    const subjectBreakdown: Record<string, { total: number; correct: number }> = {};

    questions.forEach((q: Question, idx: number) => {
      const selected = userAnswers[idx];
      const subj = q.subject || 'General';
      if (!subjectBreakdown[subj]) subjectBreakdown[subj] = { total: 0, correct: 0 };
      subjectBreakdown[subj].total += 1;

      if (selected === null || selected === undefined) {
        unansweredCount += 1;
      } else if (Number(selected) === Number(q.correctOptionIndex)) {
        correctCount += 1;
        subjectBreakdown[subj].correct += 1;
      } else {
        incorrectCount += 1;
      }
    });

    const totalQuestions = questions.length;
    const score = (correctCount * 4) - (incorrectCount * 1);
    const totalMarks = totalQuestions * 4;
    const accuracyPercentage = (correctCount + incorrectCount) > 0
      ? Number(((correctCount / (correctCount + incorrectCount)) * 100).toFixed(1))
      : 0;

    const resultSummary: TestResultSummary = {
      id: 'res-' + Date.now(),
      testName: testName || 'Practice Test',
      type: type || 'practice',
      score,
      totalMarks,
      totalQuestions,
      correctCount,
      incorrectCount,
      unansweredCount,
      accuracyPercentage,
      timeTakenSeconds: Number(durationSeconds) || 120,
      completedAt: new Date().toISOString(),
      subjectBreakdown
    };

    await recordTestAttemptToSupabase(resultSummary, userAnswers, questions);
    db.logAudit('ayush@neetbuddy.com', 'SUBMIT_TEST', 'TEST_ATTEMPT', `Scored ${score}/${totalMarks} (${accuracyPercentage}%) in ${testName}`);

    return res.json({ result: resultSummary });
  });

  // 6. AI Chatbot & Controller Endpoint (Gemini API Integration)
  app.post('/api/ai/doubt', async (req: Request, res: Response) => {
    const { prompt, subject = 'NEET Preparation', appContext = {} } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt string is required.' });
    }

    if (!aiClient) {
      // Intelligent fallback when API key is missing
      const lower = prompt.toLowerCase();
      let action: any = null;
      let reply = `In ${subject}, focus on NCERT core concepts and formula derivations. Check formulas and practice chapter-wise questions!`;

      if (lower.includes('physics')) {
        action = { type: 'NAVIGATE', view: 'practice', subject: 'Physics' };
        reply = `Opening Physics practice! Physics in NEET UG 2026 tests 20 NMC units. Focus on Kinematics, Optics, and Electrostatics.`;
      } else if (lower.includes('chemistry')) {
        action = { type: 'NAVIGATE', view: 'practice', subject: 'Chemistry' };
        reply = `Opening Chemistry practice! Chemistry covers Physical, Organic, and Inorganic. Revise Chemical Bonding and Equilibrium.`;
      } else if (lower.includes('biology') || lower.includes('botany') || lower.includes('zoology')) {
        action = { type: 'NAVIGATE', view: 'practice', subject: 'Biology' };
        reply = `Opening Biology practice! Biology accounts for 360 marks in NEET. Line-by-line NCERT diagrams are essential.`;
      } else if (lower.includes('mock') || lower.includes('test')) {
        action = { type: 'NAVIGATE', view: 'tests' };
        reply = `Taking you to Mock Tests! Solve 180 questions in 3 hours with +4 / -1 marking.`;
      } else if (lower.includes('performance') || lower.includes('weak') || lower.includes('score')) {
        action = { type: 'NAVIGATE', view: 'perf' };
        reply = `Opening your Performance & Analytics dashboard! Reviewing weak areas reduces negative marking.`;
      }

      return res.json({ reply, action });
    }

    try {
      const userContextStr = JSON.stringify(appContext);
      const systemInstruction = `You are NEETBuddy AI Assistant & Web App Controller for NEET UG 2026.
You have full access and control over the NEETBuddy application and the student's progress data.
Student App Data: ${userContextStr}

Capabilities:
1. Answer NEET doubts for Physics, Chemistry, Botany, and Zoology with step-by-step NCERT explanations.
2. Guide the user based on their performance, accuracy, and weak areas.
3. Suggest actions like practicing specific subjects, taking mock tests, or reviewing weak topics.

Format your text response cleanly with clear points or concise explanations.`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `${systemInstruction}\n\nStudent Message: ${prompt}`
      });

      const reply = response.text || 'I could not generate a response. Please try rephrasing your question.';
      return res.json({ reply });
    } catch (err: any) {
      console.error('Gemini API Error:', err);
      return res.status(500).json({ error: 'Failed to contact Gemini AI backend.', details: err?.message || String(err) });
    }
  });

  // 7. Admin Metrics & Audit Logs
  app.get('/api/admin/stats', async (_req: Request, res: Response) => {
    const questions = db.getQuestions();
    const users = db.getUsers();
    const testResults = db.getTestResults();
    const importBatches = db.getImportBatches();
    const supabaseStats = await getSupabaseStats();

    return res.json({
      totalQuestions: questions.length,
      publishedQuestions: questions.filter(q => q.status === 'published').length,
      totalUsers: users.length,
      activeStudents: users.filter(u => u.role === 'student').length,
      totalTestAttempts: testResults.length,
      totalPdfBatches: importBatches.length,
      supabase: supabaseStats,
      subjectCounts: {
        Physics: questions.filter(q => q.subject === 'Physics').length,
        Chemistry: questions.filter(q => q.subject === 'Chemistry').length,
        Botany: questions.filter(q => q.subject === 'Botany').length,
        Zoology: questions.filter(q => q.subject === 'Zoology').length
      }
    });
  });

  app.get('/api/admin/audit-logs', (_req: Request, res: Response) => {
    return res.json({ auditLogs: db.getAuditLogs() });
  });

  // 8. Serve Vite frontend in development or static dist in production
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`🚀 NEETBuddy Full-Stack Server running at http://localhost:${PORT}`);
  });
}

createServer().catch((err) => {
  console.error('Failed to start NEETBuddy server:', err);
});
