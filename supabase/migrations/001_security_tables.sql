-- ============================================================
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- AI Audit Logs table
-- Records every AI call with token counts, route, success/failure.
-- Use this to: debug errors, monitor costs, spot abuse, and give
-- Claude Code context when fixing future bugs.

create table if not exists ai_audit_logs (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  route         text not null,
  model         text not null,
  input_tokens  integer not null default 0,
  output_tokens integer not null default 0,
  total_tokens  integer not null default 0,
  success       boolean not null default true,
  error_code    text,
  error_message text,
  duration_ms   integer,
  created_at    timestamptz not null default now()
);

-- Index for daily token lookups (used in token cap checks)
create index if not exists ai_audit_logs_user_date
  on ai_audit_logs (user_id, created_at desc);

-- Index for error monitoring
create index if not exists ai_audit_logs_errors
  on ai_audit_logs (success, created_at desc)
  where success = false;

-- Row Level Security — users can only see their own logs
alter table ai_audit_logs enable row level security;

create policy "Users can view own audit logs"
  on ai_audit_logs for select
  using (auth.uid() = user_id);

-- Service role can insert (used by server-side API routes)
create policy "Service role can insert audit logs"
  on ai_audit_logs for insert
  with check (true);
