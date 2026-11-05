import fs from 'fs';
import path from 'path';
import { INITIAL_QUESTION_BANK } from '../data/initialQuestionBank';
import { Question, UserProfile, UserNote, Flashcard, StudyTask, ImportBatch, AuditLog, TestResultSummary } from '../types/neetbuddy';

const DATA_DIR = path.resolve(process.cwd(), '.data');
const DB_FILE = path.resolve(DATA_DIR, 'db.json');

export interface DatabaseSchema {
  users: UserProfile[];
  questions: Question[];
  notes: UserNote[];
  flashcards: Flashcard[];
  studyTasks: StudyTask[];
  testResults: TestResultSummary[];
  improvementBook: Array<{
    id: string;
    userId: string;
    questionId: string;
    flag: 'incorrect' | 'marked' | 'later';
    status: 'pending' | 'mastered';
    attemptCount: number;
    lastAttemptedAt: string;
  }>;
  importBatches: ImportBatch[];
  auditLogs: AuditLog[];
}

const DEFAULT_DB: DatabaseSchema = {
  users: [
    {
      id: 'usr-admin-1',
      fullName: 'Admin Doctor',
      email: 'admin@neetbuddy.com',
      phone: '9876543210',
      targetYear: 2026,
      classLevel: 'Educator',
      role: 'super_admin',
      createdAt: new Date().toISOString()
    },
    {
      id: 'usr-student-1',
      fullName: 'Ayush Kumar',
      email: 'ayush@neetbuddy.com',
      phone: '9988776655',
      targetYear: 2026,
      classLevel: 'Class 12',
      role: 'student',
      createdAt: new Date().toISOString()
    }
  ],
  questions: INITIAL_QUESTION_BANK,
  notes: [
    {
      id: 'note-1',
      userId: 'usr-student-1',
      title: 'Laws of Motion – Short Notes',
      subject: 'Physics',
      chapter: 'Laws of Motion',
      contentHtml: '<p><b>Newton’s Second Law:</b> F = dp/dt = ma. Friction types: Static (f_s ≤ μ_s N), Kinetic (f_k = μ_k N). Free body diagrams are key!</p>',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  flashcards: [
    {
      id: 'fc-1',
      deckName: 'Physics',
      front: 'Dimensional formula of force?',
      back: '[MLT⁻²]',
      isKnown: true
    },
    {
      id: 'fc-2',
      deckName: 'Chemistry',
      front: 'Avogadro’s number value?',
      back: '6.022 × 10²³ mol⁻¹',
      isKnown: false
    }
  ],
  studyTasks: [
    { id: 'task-1', dayOfWeek: 0, title: 'Kinematics 20 Numerical Practice', subject: 'Physics', estimatedMinutes: 60, isCompleted: true },
    { id: 'task-2', dayOfWeek: 0, title: 'Chemical Bonding VSEPR Revision', subject: 'Chemistry', estimatedMinutes: 45, isCompleted: false },
    { id: 'task-3', dayOfWeek: 0, title: 'Cell Biology Diagram Practice', subject: 'Botany', estimatedMinutes: 45, isCompleted: false }
  ],
  testResults: [],
  improvementBook: [],
  importBatches: [],
  auditLogs: [
    {
      id: 'log-1',
      actorEmail: 'system',
      action: 'INITIALIZE_DATABASE',
      entityType: 'SYSTEM',
      details: 'NEETBuddy database initialized with initial canonical question bank.',
      createdAt: new Date().toISOString()
    }
  ]
};

export class LocalDatabase {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        // Merge in initial questions if missing
        if (!parsed.questions || parsed.questions.length === 0) {
          parsed.questions = INITIAL_QUESTION_BANK;
        }
        return parsed;
      }
    } catch (e) {
      console.error('Error loading local database file:', e);
    }
    this.save(DEFAULT_DB);
    return DEFAULT_DB;
  }

  public save(data?: DatabaseSchema) {
    if (data) this.data = data;
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error writing database to disk:', e);
    }
  }

  // Users
  public getUsers() { return this.data.users; }
  public getUserByEmail(email: string) { return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase()); }
  public addUser(user: UserProfile) {
    this.data.users.push(user);
    this.save();
    return user;
  }

  // Questions
  public getQuestions() { return this.data.questions; }
  public getQuestionById(id: string) { return this.data.questions.find(q => q.id === id); }
  public addQuestion(question: Question) {
    this.data.questions.unshift(question);
    this.save();
    return question;
  }
  public updateQuestion(id: string, updates: Partial<Question>) {
    const idx = this.data.questions.findIndex(q => q.id === id);
    if (idx !== -1) {
      this.data.questions[idx] = { ...this.data.questions[idx], ...updates };
      this.save();
      return this.data.questions[idx];
    }
    return null;
  }
  public deleteQuestion(id: string) {
    this.data.questions = this.data.questions.filter(q => q.id !== id);
    this.save();
  }

  // Notes
  public getNotes(userId: string) { return this.data.notes.filter(n => n.userId === userId || !n.userId); }
  public saveNote(note: UserNote) {
    const idx = this.data.notes.findIndex(n => n.id === note.id);
    if (idx !== -1) {
      this.data.notes[idx] = note;
    } else {
      this.data.notes.unshift(note);
    }
    this.save();
    return note;
  }
  public deleteNote(id: string) {
    this.data.notes = this.data.notes.filter(n => n.id !== id);
    this.save();
  }

  // Flashcards
  public getFlashcards() { return this.data.flashcards; }
  public toggleFlashcardKnown(id: string) {
    const fc = this.data.flashcards.find(f => f.id === id);
    if (fc) {
      fc.isKnown = !fc.isKnown;
      this.save();
    }
    return fc;
  }

  // Test Results
  public addTestResult(result: TestResultSummary) {
    this.data.testResults.unshift(result);
    this.save();
    return result;
  }
  public getTestResults() { return this.data.testResults; }

  // PDF Batches & Audit Logs
  public addImportBatch(batch: ImportBatch) {
    this.data.importBatches.unshift(batch);
    this.save();
    return batch;
  }
  public getImportBatches() { return this.data.importBatches; }

  public logAudit(actorEmail: string, action: string, entityType: string, details: string) {
    const log: AuditLog = {
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      actorEmail,
      action,
      entityType,
      details,
      createdAt: new Date().toISOString()
    };
    this.data.auditLogs.unshift(log);
    this.save();
    return log;
  }
  public getAuditLogs() { return this.data.auditLogs; }
}

export const db = new LocalDatabase();
