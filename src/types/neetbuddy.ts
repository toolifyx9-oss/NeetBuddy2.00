export type SubjectName = 'Physics' | 'Chemistry' | 'Botany' | 'Zoology';

export interface Question {
  id: string;
  subject: SubjectName;
  chapter: string;
  topic: string;
  statement: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questionType?: 'single_correct' | 'multiple_correct' | 'assertion_reason' | 'numerical';
  marks?: number;
  negativeMarks?: number;
  ncertReference?: string;
  pyqYear?: number;
  isDpp?: boolean;
  status?: 'draft' | 'review' | 'published' | 'archived';
  createdAt?: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  targetYear: number;
  classLevel: string;
  role: 'student' | 'admin' | 'super_admin';
  avatarUrl?: string;
  createdAt: string;
}

export interface GoalItem {
  id: string;
  title: string;
  key?: 'q' | 'c' | 'm';
  targetCount: number;
  completed: boolean;
  navigateTo?: string;
}

export interface TestSession {
  id: string;
  userId: string;
  mode: 'practice' | 'mock';
  type: 'practice' | 'mock' | 'pyq' | 'dpp' | 'custom' | 'ib';
  name: string;
  subject?: SubjectName;
  chapter?: string;
  topic?: string;
  questions: Question[];
  answers: Record<number, number | null>; // questionIndex -> selectedOptionIndex
  bookmarks: Record<number, boolean>;
  visited: Record<number, boolean>;
  timeSpentSeconds: number;
  timeLimitSeconds: number;
  timed: boolean;
  isCompleted: boolean;
  startedAt: string;
  completedAt?: string;
  score?: number;
  totalMarks?: number;
  accuracy?: number;
}

export interface TestResultSummary {
  id: string;
  testName: string;
  type: string;
  score: number;
  totalMarks: number;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  accuracyPercentage: number;
  timeTakenSeconds: number;
  completedAt: string;
  subjectBreakdown: Record<string, { total: number; correct: number }>;
}

export interface ImprovementItem {
  id: string;
  question: Question;
  userAnswerIndex: number;
  flag: 'incorrect' | 'marked' | 'later';
  status: 'pending' | 'mastered';
  attemptCount: number;
  lastAttemptedAt: string;
}

export interface UserNote {
  id: string;
  userId: string;
  title: string;
  subject: SubjectName;
  chapter: string;
  contentHtml: string;
  createdAt: string;
  updatedAt: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  deckName: string;
  isKnown: boolean;
}

export interface StudyTask {
  id: string;
  dayOfWeek: number; // 0 = Mon, 6 = Sun
  title: string;
  subject: SubjectName | 'Revision' | 'Mock';
  estimatedMinutes: number;
  isCompleted: boolean;
}

export interface ImportBatch {
  id: string;
  filename: string;
  totalDetected: number;
  approvedCount: number;
  rejectedCount: number;
  status: 'processing' | 'pending_review' | 'completed' | 'failed';
  extractedQuestions: Question[];
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actorEmail: string;
  action: string;
  entityType: string;
  details: string;
  createdAt: string;
}
