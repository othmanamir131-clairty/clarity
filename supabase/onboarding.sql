-- Run once in Supabase SQL Editor
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS display_name text,
  ADD COLUMN IF NOT EXISTS creator_type text,
  ADD COLUMN IF NOT EXISTS onboarded boolean DEFAULT false;
