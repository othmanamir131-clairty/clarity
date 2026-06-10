-- Run once in Supabase SQL Editor

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS display_name text,
  ADD COLUMN IF NOT EXISTS creator_type text,
  ADD COLUMN IF NOT EXISTS onboarded boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS ai_messages_today integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ai_usage_date date;

-- Ensure one profile row per user (required for upsert)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'profiles_user_id_key'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_user_id_key UNIQUE (user_id);
  END IF;
END $$;

-- Let users read and write their own profile
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);
