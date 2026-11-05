import fs from 'fs';
import path from 'path';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Question, UserProfile, TestResultSummary, AuditLog } from '../types/neetbuddy';
import { INITIAL_QUESTION_BANK } from '../data/initialQuestionBank';
import { db } from './db';

const DATA_DIR = path.resolve(process.cwd(), '.data');
const CONFIG_FILE = path.resolve(DATA_DIR, 'supabase-config.json');

export interface SupabaseConfig {
  url: string;
  key: string;
  configuredAt?: string;
}

let cachedClient: SupabaseClient | null = null;
let cachedConfig: SupabaseConfig | null = null;

export function loadSupabaseConfig(): SupabaseConfig {
  // 1. Check persistent config file first
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const raw = fs.readFileSync(CONFIG_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed.url && parsed.key) {
        cachedConfig = parsed;
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading supabase-config.json:', err);
  }

  // 2. Check environment variables
  const envUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
  const envKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

  if (envUrl && envKey && !envUrl.includes('placeholder-supabase')) {
    cachedConfig = { url: envUrl, key: envKey, configuredAt: new Date().toISOString() };
    return cachedConfig;
  }

  return { url: '', key: '' };
}

export function saveSupabaseConfig(url: string, key: string): SupabaseConfig {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const cleanUrl = url.trim().replace(/\/$/, '');
    const cleanKey = key.trim();
    const config: SupabaseConfig = {
      url: cleanUrl,
      key: cleanKey,
      configuredAt: new Date().toISOString()
    };
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
    cachedConfig = config;
    cachedClient = null; // reset cached client
    return config;
  } catch (err) {
    console.error('Error saving supabase config:', err);
    throw new Error('Failed to save Supabase credentials to disk.');
  }
}

export function getSupabaseBackendClient(): SupabaseClient | null {
  if (cachedClient) return cachedClient;

  const config = cachedConfig || loadSupabaseConfig();
  if (config.url && config.key && !config.url.includes('placeholder')) {
    try {
      cachedClient = createClient(config.url, config.key, {
        auth: {
          persistSession: false,
          autoRefreshToken: false
        }
      });
      return cachedClient;
    } catch (e) {
      console.error('Failed to create Supabase client:', e);
      return null;
    }
  }
  return null;
}

export async function testSupabaseConnection(): Promise<{
  connected: boolean;
  latencyMs: number;
  error?: string;
  tablesFound?: string[];
}> {
  const client = getSupabaseBackendClient();
  if (!client) {
    return { connected: false, latencyMs: 0, error: 'Supabase URL or Key not configured.' };
  }

  const start = Date.now();
  try {
    // Attempt reading from questions or checking connection
    const { data, error } = await client.from('questions').select('id').limit(1);
    const latencyMs = Date.now() - start;

    if (error) {
      // Check if table missing error (PGRST205 / 42P01) or auth error
      if (error.code === '42P01' || error.message.includes('relation "public.questions" does not exist')) {
        return {
          connected: true,
          latencyMs,
          error: 'Connected to Supabase! Note: Database schema tables are not yet created. Run the master SQL migration in your Supabase SQL Editor.',
          tablesFound: []
        };
      }
      return { connected: false, latencyMs, error: error.message };
    }

    return { connected: true, latencyMs, tablesFound: ['questions'] };
  } catch (err: any) {
    return {
      connected: false,
      latencyMs: Date.now() - start,
      error: err?.message || String(err)
    };
  }
}

export async function getSupabaseStats() {
  const client = getSupabaseBackendClient();
  const config = cachedConfig || loadSupabaseConfig();
  const isConfigured = !!(config.url && config.key);

  if (!client || !isConfigured) {
    return {
      configured: false,
      connected: false,
      url: '',
      tableStats: {
        questions: db.getQuestions().length,
        users: db.getUsers().length,
        testAttempts: db.getTestResults().length,
        auditLogs: db.getAuditLogs().length
      },
      mode: 'local_storage'
    };
  }

  const connTest = await testSupabaseConnection();

  let qCount = 0;
  let uCount = 0;
  let tCount = 0;
  let aCount = 0;

  if (connTest.connected) {
    try {
      const qRes = await client.from('questions').select('*', { count: 'exact', head: true });
      qCount = qRes.count || 0;
    } catch (e) {}

    try {
      const uRes = await client.from('profiles').select('*', { count: 'exact', head: true });
      uCount = uRes.count || 0;
    } catch (e) {}

    try {
      const tRes = await client.from('test_attempts').select('*', { count: 'exact', head: true });
      tCount = tRes.count || 0;
    } catch (e) {}

    try {
      const aRes = await client.from('audit_logs').select('*', { count: 'exact', head: true });
      aCount = aRes.count || 0;
    } catch (e) {}
  }

  // Mask url for safety
  const maskedUrl = config.url.replace(/https?:\/\/([^.]+)\..*/, 'https://$1.supabase.co');

  return {
    configured: true,
    connected: connTest.connected,
    latencyMs: connTest.latencyMs,
    url: maskedUrl,
    error: connTest.error,
    tableStats: {
      questions: qCount,
      users: uCount,
      testAttempts: tCount,
      auditLogs: aCount
    },
    mode: connTest.connected ? 'supabase_cloud' : 'local_storage_fallback'
  };
}

export async function seedQuestionsToSupabase(): Promise<{
  success: boolean;
  insertedCount: number;
  message: string;
}> {
  const client = getSupabaseBackendClient();
  if (!client) {
    throw new Error('Supabase is not configured.');
  }

  const allQuestions = db.getQuestions();
  const rows = allQuestions.map((q) => ({
    id: q.id.length === 36 ? q.id : undefined, // only use valid uuid or let supabase generate
    statement: q.statement,
    options: q.options,
    correct_option_index: q.correctOptionIndex,
    explanation: q.explanation,
    difficulty: q.difficulty || 'Medium',
    status: 'published',
    ncert_reference: q.ncertReference || null,
    pyq_year: q.pyqYear || null,
    is_dpp: q.isDpp || false,
    marks: q.marks || 4,
    negative_marks: q.negativeMarks || 1
  }));

  try {
    const { data, error } = await client.from('questions').insert(rows).select();
    if (error) {
      throw error;
    }

    return {
      success: true,
      insertedCount: data ? data.length : rows.length,
      message: `Successfully seeded ${data ? data.length : rows.length} NEET questions into Supabase!`
    };
  } catch (err: any) {
    console.error('Error seeding questions to Supabase:', err);
    throw new Error(`Failed to seed Supabase questions: ${err?.message || err}`);
  }
}

// Fetch questions from Supabase with fallback to local db
export async function getQuestionsFromSupabase(params?: {
  subject?: string;
  chapter?: string;
  topic?: string;
  search?: string;
  difficulty?: string;
  limit?: number;
  page?: number;
}): Promise<{ questions: Question[]; total: number; source: 'supabase' | 'local' }> {
  const client = getSupabaseBackendClient();
  const limit = Math.min(100, Number(params?.limit) || 50);
  const page = Math.max(1, Number(params?.page) || 1);
  const offset = (page - 1) * limit;

  if (client) {
    try {
      let query = client
        .from('questions')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (params?.search) {
        query = query.ilike('statement', `%${params.search}%`);
      }
      if (params?.difficulty) {
        query = query.eq('difficulty', params.difficulty);
      }

      const { data, count, error } = await query;
      if (!error && data && data.length > 0) {
        const questions: Question[] = data.map((row: any) => ({
          id: String(row.id),
          subject: (row.subject || 'Physics') as any,
          chapter: row.chapter || 'General',
          topic: row.topic || 'General',
          statement: row.statement,
          options: Array.isArray(row.options) ? row.options : (typeof row.options === 'string' ? JSON.parse(row.options) : []),
          correctOptionIndex: Number(row.correct_option_index ?? 0),
          explanation: row.explanation || '',
          difficulty: (row.difficulty || 'Medium') as any,
          marks: Number(row.marks ?? 4),
          negativeMarks: Number(row.negative_marks ?? 1),
          ncertReference: row.ncert_reference || undefined,
          pyqYear: row.pyq_year || undefined,
          isDpp: Boolean(row.is_dpp),
          status: row.status || 'published',
          createdAt: row.created_at
        }));

        return {
          questions,
          total: count || questions.length,
          source: 'supabase'
        };
      }
    } catch (e) {
      console.warn('Supabase query failed, falling back to local database:', e);
    }
  }

  // Local DB Fallback
  let questions = db.getQuestions();
  if (params?.subject) {
    questions = questions.filter(q => q.subject.toLowerCase() === params.subject!.toLowerCase());
  }
  if (params?.chapter) {
    questions = questions.filter(q => q.chapter.toLowerCase() === params.chapter!.toLowerCase());
  }
  if (params?.search) {
    const term = params.search.toLowerCase();
    questions = questions.filter(q =>
      q.statement.toLowerCase().includes(term) ||
      q.chapter.toLowerCase().includes(term) ||
      q.topic.toLowerCase().includes(term)
    );
  }

  const total = questions.length;
  const paginated = questions.slice(offset, offset + limit);

  return {
    questions: paginated,
    total,
    source: 'local'
  };
}

// Insert Question to Supabase
export async function addQuestionToSupabase(question: Question): Promise<Question> {
  const client = getSupabaseBackendClient();
  if (client) {
    try {
      const row = {
        statement: question.statement,
        options: question.options,
        correct_option_index: question.correctOptionIndex,
        explanation: question.explanation,
        difficulty: question.difficulty,
        marks: question.marks || 4,
        negative_marks: question.negativeMarks || 1,
        ncert_reference: question.ncertReference,
        status: question.status || 'published',
      };
      const { data, error } = await client.from('questions').insert(row).select().single();
      if (!error && data) {
        question.id = String(data.id);
      }
    } catch (e) {
      console.warn('Could not insert question to Supabase, saved locally:', e);
    }
  }
  db.addQuestion(question);
  return question;
}

// Save Test Attempt to Supabase
export async function recordTestAttemptToSupabase(result: TestResultSummary, userAnswers?: Record<number, number | null>, questions?: Question[]) {
  const client = getSupabaseBackendClient();
  db.addTestResult(result);

  if (client) {
    try {
      const { data: attempt, error } = await client
        .from('test_attempts')
        .insert({
          test_title: result.testName,
          test_type: result.type,
          score: result.score,
          total_marks: result.totalMarks,
          total_questions: result.totalQuestions,
          correct_count: result.correctCount,
          incorrect_count: result.incorrectCount,
          unanswered_count: result.unansweredCount,
          accuracy_percentage: result.accuracyPercentage,
          duration_seconds: result.timeTakenSeconds,
          completed_at: result.completedAt
        })
        .select()
        .single();

      if (!error && attempt && questions && userAnswers) {
        const responseRows = questions.map((q, idx) => ({
          attempt_id: attempt.id,
          question_id: q.id.length === 36 ? q.id : undefined,
          selected_option_index: userAnswers[idx] ?? null,
          is_correct: userAnswers[idx] === q.correctOptionIndex,
          marks_awarded: userAnswers[idx] === q.correctOptionIndex ? 4 : (userAnswers[idx] !== null && userAnswers[idx] !== undefined ? -1 : 0)
        })).filter(r => r.question_id);

        if (responseRows.length > 0) {
          await client.from('test_responses').insert(responseRows);
        }
      }
    } catch (e) {
      console.warn('Could not record test attempt to Supabase:', e);
    }
  }
  return result;
}

// Save Audit Log to Supabase
export async function recordAuditLogToSupabase(log: AuditLog) {
  const client = getSupabaseBackendClient();
  db.logAudit(log.actorEmail, log.action, log.entityType, log.details);

  if (client) {
    try {
      await client.from('audit_logs').insert({
        action: log.action,
        entity_type: log.entityType,
        details: { text: log.details, actor: log.actorEmail },
        created_at: log.createdAt
      });
    } catch (e) {
      // ignore
    }
  }
}
