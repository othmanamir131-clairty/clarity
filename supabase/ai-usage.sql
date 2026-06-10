-- Run once in Supabase SQL Editor (if not already in user-data.sql)

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
