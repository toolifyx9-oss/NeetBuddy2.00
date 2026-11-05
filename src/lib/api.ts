import { Question, UserProfile, TestResultSummary, UserNote, Flashcard, StudyTask, ImportBatch, AuditLog } from '../types/neetbuddy';

const API_BASE = '/api';

export async function fetchSyllabus() {
  try {
    const res = await fetch(`${API_BASE}/syllabus`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.error('Fetch syllabus error:', e);
  }
  return null;
}

export async function fetchQuestions(params?: { subject?: string; chapter?: string; topic?: string; search?: string; limit?: number }) {
  try {
    const query = new URLSearchParams();
    if (params?.subject) query.append('subject', params.subject);
    if (params?.chapter) query.append('chapter', params.chapter);
    if (params?.topic) query.append('topic', params.topic);
    if (params?.search) query.append('search', params.search);
    if (params?.limit) query.append('limit', String(params.limit));

    const res = await fetch(`${API_BASE}/questions?${query.toString()}`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.error('Fetch questions error:', e);
  }
  return { questions: [], total: 0 };
}

export async function createQuestion(data: Partial<Question>) {
  const res = await fetch(`${API_BASE}/questions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to create question');
  }
  return await res.json();
}

export async function deleteQuestionApi(id: string) {
  const res = await fetch(`${API_BASE}/questions/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete question');
  return await res.json();
}

export async function parsePdfUpload(formData: FormData) {
  const res = await fetch(`${API_BASE}/admin/parse-pdf`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to parse PDF document');
  }
  return await res.json();
}

export async function submitTestResponse(payload: {
  testName: string;
  type: string;
  questions: Question[];
  userAnswers: Record<number, number | null>;
  durationSeconds: number;
}) {
  const res = await fetch(`${API_BASE}/tests/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to submit test');
  }
  return await res.json();
}

export async function askAiDoubt(prompt: string, subject: string = 'Physics') {
  const res = await fetch(`${API_BASE}/ai/doubt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, subject })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'AI Doubt Solver request failed.');
  }
  return await res.json();
}

export async function fetchAdminStats() {
  const res = await fetch(`${API_BASE}/admin/stats`);
  if (!res.ok) throw new Error('Failed to fetch admin stats');
  return await res.json();
}

export async function fetchAuditLogs() {
  const res = await fetch(`${API_BASE}/admin/audit-logs`);
  if (!res.ok) throw new Error('Failed to fetch audit logs');
  return await res.json();
}

// Supabase Real Backend APIs
export async function fetchSupabaseStatus() {
  try {
    const res = await fetch(`${API_BASE}/supabase/status`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.error('Failed to fetch Supabase status:', e);
  }
  return { configured: false, connected: false, mode: 'local_storage' };
}

export async function saveSupabaseConfigApi(url: string, key: string) {
  const res = await fetch(`${API_BASE}/supabase/config`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, key })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to save Supabase credentials');
  }
  return await res.json();
}

export async function seedSupabaseQuestionsApi() {
  const res = await fetch(`${API_BASE}/supabase/seed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to seed questions to Supabase');
  }
  return await res.json();
}

export async function fetchSupabaseSchemaSql() {
  const res = await fetch(`${API_BASE}/supabase/schema-sql`);
  if (!res.ok) throw new Error('Failed to fetch schema SQL');
  return await res.json();
}
