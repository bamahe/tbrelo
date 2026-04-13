-- =============================================
-- TB Relo Q&A Tables — Run this in Supabase SQL Editor
-- Dashboard → SQL Editor → New Query → Paste → Run
-- =============================================

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  blog_slug TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  question_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_pinned BOOLEAN DEFAULT FALSE,
  upvotes INT DEFAULT 0
);

-- Answers table
CREATE TABLE IF NOT EXISTS answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  answer_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_accepted BOOLEAN DEFAULT FALSE,
  upvotes INT DEFAULT 0
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_questions_blog_slug ON questions(blog_slug);
CREATE INDEX IF NOT EXISTS idx_questions_created_at ON questions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_answers_question_id ON answers(question_id);
CREATE INDEX IF NOT EXISTS idx_answers_created_at ON answers(created_at DESC);

-- Enable Row Level Security
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for questions
CREATE POLICY "Anyone can read questions" ON questions
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create questions" ON questions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own questions" ON questions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own questions" ON questions
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for answers
CREATE POLICY "Anyone can read answers" ON answers
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create answers" ON answers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own answers" ON answers
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own answers" ON answers
  FOR DELETE USING (auth.uid() = user_id);
