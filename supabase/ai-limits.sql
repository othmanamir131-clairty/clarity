-- ============================================================
-- Clarity — AI daily limits (run once in Supabase SQL Editor)
-- ============================================================
-- The app counts today's AI messages by counting each user's
-- ideas saved today. Every /api/chat call saves one idea row.
-- Safe to run more than once.

-- 1) Tie ideas to the logged-in user
ALTER TABLE ideas
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- 2) Index so counting today's messages is fast
CREATE INDEX IF NOT EXISTS ideas_user_id_created_at_idx
  ON ideas (user_id, created_at DESC);

-- 3) Row-level security — users only see/count their own ideas
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own ideas" ON ideas;
CREATE POLICY "Users can view own ideas"
  ON ideas FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own ideas" ON ideas;
CREATE POLICY "Users can insert own ideas"
  ON ideas FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own ideas" ON ideas;
CREATE POLICY "Users can update own ideas"
  ON ideas FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own ideas" ON ideas;
CREATE POLICY "Users can delete own ideas"
  ON ideas FOR DELETE
  USING (auth.uid() = user_id);
