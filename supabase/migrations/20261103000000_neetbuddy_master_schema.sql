-- NEETBuddy Master Database Schema (Supabase / PostgreSQL)
-- Created for 50,000+ Question Bank scaling with RLS policies

-- Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 1. USERS & ACCESS CONTROL
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT UNIQUE,
  target_year INTEGER DEFAULT 2026,
  class_level TEXT DEFAULT 'Class 12',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('student', 'admin', 'super_admin', 'educator')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

CREATE TABLE IF NOT EXISTS public.user_preferences (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  dark_mode BOOLEAN DEFAULT FALSE,
  notifications_enabled BOOLEAN DEFAULT TRUE,
  preferred_language TEXT DEFAULT 'English',
  daily_question_goal INTEGER DEFAULT 50,
  daily_study_time_goal INTEGER DEFAULT 120
);

-- 2. ACADEMIC STRUCTURE
CREATE TABLE IF NOT EXISTS public.subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  code TEXT UNIQUE NOT NULL,
  icon TEXT,
  bg_color TEXT,
  display_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.chapters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  chapter_number INTEGER NOT NULL,
  class_level TEXT DEFAULT 'Class 11',
  weightage_percentage NUMERIC(5,2) DEFAULT 0.0,
  UNIQUE(subject_id, name)
);

CREATE TABLE IF NOT EXISTS public.topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chapter_id UUID REFERENCES public.chapters(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  topic_number INTEGER NOT NULL,
  UNIQUE(chapter_id, name)
);

-- 3. CANONICAL QUESTION BANK (Scaled for 50,000+ Questions)
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_id UUID REFERENCES public.subjects(id),
  chapter_id UUID REFERENCES public.chapters(id),
  topic_id UUID REFERENCES public.topics(id),
  statement TEXT NOT NULL,
  options JSONB NOT NULL, -- Array of string options: ["Option A", "Option B", ...]
  correct_option_index INTEGER NOT NULL, -- 0, 1, 2, 3
  explanation TEXT,
  difficulty TEXT CHECK (difficulty IN ('Easy', 'Medium', 'Hard')) DEFAULT 'Medium',
  question_type TEXT DEFAULT 'single_correct', -- single_correct, multiple_correct, assertion_reason, statement_based
  marks INTEGER DEFAULT 4,
  negative_marks INTEGER DEFAULT 1,
  ncert_reference TEXT,
  pyq_year INTEGER,
  is_dpp BOOLEAN DEFAULT FALSE,
  status TEXT CHECK (status IN ('draft', 'review', 'published', 'archived')) DEFAULT 'published',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for Fast Question Search and Filtering
CREATE INDEX IF NOT EXISTS idx_questions_subject ON public.questions(subject_id);
CREATE INDEX IF NOT EXISTS idx_questions_chapter ON public.questions(chapter_id);
CREATE INDEX IF NOT EXISTS idx_questions_topic ON public.questions(topic_id);
CREATE INDEX IF NOT EXISTS idx_questions_status ON public.questions(status);
CREATE INDEX IF NOT EXISTS idx_questions_pyq ON public.questions(pyq_year) WHERE pyq_year IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_questions_trgm ON public.questions USING gin (statement gin_trgm_ops);

-- 4. PDF & BULK IMPORT BATCHES
CREATE TABLE IF NOT EXISTS public.import_batches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename TEXT NOT NULL,
  uploaded_by UUID REFERENCES public.profiles(id),
  total_detected INTEGER DEFAULT 0,
  approved_count INTEGER DEFAULT 0,
  rejected_count INTEGER DEFAULT 0,
  status TEXT CHECK (status IN ('processing', 'pending_review', 'completed', 'failed')) DEFAULT 'processing',
  raw_extracted_json JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. MOCK TESTS & ATTEMPTS
CREATE TABLE IF NOT EXISTS public.mock_tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category TEXT DEFAULT 'Full Syllabus', -- Full Syllabus, Chapter-wise, Part Test, Custom
  duration_minutes INTEGER DEFAULT 180,
  total_questions INTEGER DEFAULT 180,
  total_marks INTEGER DEFAULT 720,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.mock_test_questions (
  test_id UUID REFERENCES public.mock_tests(id) ON DELETE CASCADE,
  question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
  display_order INTEGER NOT NULL,
  PRIMARY KEY(test_id, question_id)
);

CREATE TABLE IF NOT EXISTS public.test_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  test_id UUID REFERENCES public.mock_tests(id) ON DELETE SET NULL,
  test_title TEXT NOT NULL,
  test_type TEXT DEFAULT 'mock',
  score INTEGER DEFAULT 0,
  total_marks INTEGER DEFAULT 720,
  total_questions INTEGER DEFAULT 0,
  correct_count INTEGER DEFAULT 0,
  incorrect_count INTEGER DEFAULT 0,
  unanswered_count INTEGER DEFAULT 0,
  accuracy_percentage NUMERIC(5,2) DEFAULT 0.0,
  duration_seconds INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.test_responses (
  attempt_id UUID REFERENCES public.test_attempts(id) ON DELETE CASCADE,
  question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
  selected_option_index INTEGER, -- NULL if unanswered
  is_correct BOOLEAN DEFAULT FALSE,
  marks_awarded INTEGER DEFAULT 0,
  is_bookmarked BOOLEAN DEFAULT FALSE,
  PRIMARY KEY(attempt_id, question_id)
);

-- 6. QUESTION ATTEMPTS & IMPROVEMENT BOOK
CREATE TABLE IF NOT EXISTS public.question_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
  selected_option_index INTEGER NOT NULL,
  is_correct BOOLEAN NOT NULL,
  time_spent_seconds INTEGER DEFAULT 0,
  attempted_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.improvement_book_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
  flag TEXT CHECK (flag IN ('incorrect', 'marked', 'later')) DEFAULT 'incorrect',
  status TEXT CHECK (status IN ('pending', 'mastered')) DEFAULT 'pending',
  attempt_count INTEGER DEFAULT 1,
  last_attempted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, question_id, flag)
);

-- 7. LEARNING TOOLS (Notes, Flashcards, Study Plans, Bookmarks)
CREATE TABLE IF NOT EXISTS public.notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subject_name TEXT DEFAULT 'Physics',
  chapter_name TEXT,
  content_html TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.flashcard_decks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subject_name TEXT DEFAULT 'Physics',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.flashcards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deck_id UUID REFERENCES public.flashcard_decks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  front_question TEXT NOT NULL,
  back_answer TEXT NOT NULL,
  is_known BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.study_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL, -- 0 = Monday, 6 = Sunday
  title TEXT NOT NULL,
  subject_name TEXT DEFAULT 'Physics',
  estimated_minutes INTEGER DEFAULT 45,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ROW LEVEL SECURITY (RLS) POLICIES

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.improvement_book_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_tasks ENABLE ROW LEVEL SECURITY;

-- Profiles Policy
CREATE POLICY "Public profiles are viewable by owner or admin" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')));

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Questions Policy (Students read published, Admins write)
CREATE POLICY "Anyone can view published questions" ON public.questions
  FOR SELECT USING (status = 'published' OR EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')));

CREATE POLICY "Admins can manage questions" ON public.questions
  FOR ALL USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')));

-- Student Activity Policies (Owner access)
CREATE POLICY "Users access own test attempts" ON public.test_attempts
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users access own improvement book" ON public.improvement_book_items
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users access own notes" ON public.notes
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users access own study tasks" ON public.study_tasks
  FOR ALL USING (auth.uid() = user_id);
