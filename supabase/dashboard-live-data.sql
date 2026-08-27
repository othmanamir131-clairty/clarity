-- Run once in Supabase SQL Editor
-- Fixes two dashboard stat cards: Clarity Score and Outputs Created

-- ── CLARITY SCORE (persist the latest generated score on the profile) ──────
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS clarity_score integer,
  ADD COLUMN IF NOT EXISTS clarity_report text,
  ADD COLUMN IF NOT EXISTS clarity_score_updated_at timestamptz;

-- ── OUTPUTS (allow a 'chat' type so regular AI generations count too) ──────
-- Drop whatever the existing CHECK constraint on outputs.type is named
-- (it was created inline, so the name may vary) and replace it.
DO $$
DECLARE
  con record;
BEGIN
  FOR con IN
    SELECT pgc.conname
    FROM pg_constraint pgc
    JOIN pg_class rel ON rel.oid = pgc.conrelid
    WHERE rel.relname = 'outputs'
      AND pgc.contype = 'c'
      AND pg_get_constraintdef(pgc.oid) ILIKE '%type%'
  LOOP
    EXECUTE format('ALTER TABLE outputs DROP CONSTRAINT %I', con.conname);
  END LOOP;
END $$;

ALTER TABLE outputs
  ADD CONSTRAINT outputs_type_check
  CHECK (type IN ('spreadsheet', 'brief', 'schedule_post', 'chat'));
