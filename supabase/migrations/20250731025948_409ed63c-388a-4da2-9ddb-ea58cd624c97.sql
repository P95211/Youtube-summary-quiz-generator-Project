-- Phase 1: Emergency Database Security Restoration

-- Re-enable RLS on all tables
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;

-- Drop existing conflicting policies on quiz_questions that reference auth
DROP POLICY IF EXISTS "Users can view quiz questions for their quizzes" ON public.quiz_questions;
DROP POLICY IF EXISTS "Users can create quiz questions for their quizzes" ON public.quiz_questions;
DROP POLICY IF EXISTS "Users can update quiz questions for their quizzes" ON public.quiz_questions;
DROP POLICY IF EXISTS "Users can delete quiz questions for their quizzes" ON public.quiz_questions;

-- Create public access policies for videos table
CREATE POLICY "Public can view all videos" 
ON public.videos 
FOR SELECT 
USING (true);

CREATE POLICY "Public can insert videos" 
ON public.videos 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public can update videos" 
ON public.videos 
FOR UPDATE 
USING (true);

-- Create public access policies for flashcards table
DROP POLICY IF EXISTS "Users can create their own flashcards" ON public.flashcards;

CREATE POLICY "Public can view all flashcards" 
ON public.flashcards 
FOR SELECT 
USING (true);

CREATE POLICY "Public can insert flashcards" 
ON public.flashcards 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public can update flashcards" 
ON public.flashcards 
FOR UPDATE 
USING (true);

-- Create public access policies for quizzes table
DROP POLICY IF EXISTS "Users can create their own quizzes" ON public.quizzes;

CREATE POLICY "Public can view all quizzes" 
ON public.quizzes 
FOR SELECT 
USING (true);

CREATE POLICY "Public can insert quizzes" 
ON public.quizzes 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public can update quizzes" 
ON public.quizzes 
FOR UPDATE 
USING (true);

-- Create public access policies for quiz_questions table
CREATE POLICY "Public can view all quiz questions" 
ON public.quiz_questions 
FOR SELECT 
USING (true);

CREATE POLICY "Public can insert quiz questions" 
ON public.quiz_questions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public can update quiz questions" 
ON public.quiz_questions 
FOR UPDATE 
USING (true);

-- Add content length limits to prevent abuse
ALTER TABLE public.videos ADD CONSTRAINT videos_summary_length_check CHECK (char_length(summary) <= 10000);
ALTER TABLE public.videos ADD CONSTRAINT videos_transcript_length_check CHECK (char_length(transcript) <= 100000);
ALTER TABLE public.flashcards ADD CONSTRAINT flashcards_question_length_check CHECK (char_length(question) <= 1000);
ALTER TABLE public.flashcards ADD CONSTRAINT flashcards_answer_length_check CHECK (char_length(answer) <= 2000);
ALTER TABLE public.quiz_questions ADD CONSTRAINT quiz_questions_question_length_check CHECK (char_length(question) <= 1000);