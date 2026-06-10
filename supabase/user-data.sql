-- Run once in Supabase SQL Editor
-- Locks all user data so each account only sees their own stuff

-- ── IDEAS ──────────────────────────────────────────────────────────────────
ALTER TABLE ideas
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own ideas" ON ideas;
CREATE POLICY "Users can view own ideas"
  ON ideas FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own ideas" ON ideas;
CREATE POLICY "Users can insert own ideas"
  ON ideas FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own ideas" ON ideas;
CREATE POLICY "Users can update own ideas"
  ON ideas FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own ideas" ON ideas;
CREATE POLICY "Users can delete own ideas"
  ON ideas FOR DELETE USING (auth.uid() = user_id);

-- ── PROFILES ───────────────────────────────────────────────────────────────
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS display_name text,
  ADD COLUMN IF NOT EXISTS creator_type text,
  ADD COLUMN IF NOT EXISTS onboarded boolean DEFAULT false;

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = user_id);

-- ── OUTPUTS (spreadsheets, briefs, schedule posts) ───────────────────────
CREATE TABLE IF NOT EXISTS outputs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('spreadsheet', 'brief', 'schedule_post')),
  title text,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS outputs_user_id_type_idx ON outputs (user_id, type);

ALTER TABLE outputs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own outputs" ON outputs;
CREATE POLICY "Users can view own outputs"
  ON outputs FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own outputs" ON outputs;
CREATE POLICY "Users can insert own outputs"
  ON outputs FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own outputs" ON outputs;
CREATE POLICY "Users can update own outputs"
  ON outputs FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own outputs" ON outputs;
CREATE POLICY "Users can delete own outputs"
  ON outputs FOR DELETE USING (auth.uid() = user_id);

-- ── AI USAGE (daily message limits) ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ai_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ai_usage_user_id_created_at_idx ON ai_usage (user_id, created_at);

ALTER TABLE ai_usage ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own ai usage" ON ai_usage;
CREATE POLICY "Users can view own ai usage"
  ON ai_usage FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own ai usage" ON ai_usage;
CREATE POLICY "Users can insert own ai usage"
  ON ai_usage FOR INSERT WITH CHECK (auth.uid() = user_id);
