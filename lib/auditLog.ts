/**
 * Structured audit logging for every AI call.
 * Fire-and-forget — never blocks the response.
 * Logs are queryable in Supabase for debugging, cost analysis, and abuse detection.
 *
 * Requires the ai_audit_logs table — see supabase/migrations/001_security_tables.sql
 */

import type { SupabaseClient } from '@supabase/supabase-js'

export interface AuditLogEntry {
  userId: string
  route: string          // e.g. '/api/chat', '/api/report'
  model: string
  inputTokens: number
  outputTokens: number
  success: boolean
  errorCode?: string     // e.g. 'rate_limited', 'daily_limit', 'auth_error', 'ai_error'
  errorMessage?: string
  durationMs?: number
}

/**
 * Write an audit log entry. Non-blocking — errors are only console-logged.
 */
export function logAiCall(supabase: SupabaseClient, entry: AuditLogEntry): void {
  supabase
    .from('ai_audit_logs')
    .insert({
      user_id: entry.userId,
      route: entry.route,
      model: entry.model,
      input_tokens: entry.inputTokens,
      output_tokens: entry.outputTokens,
      total_tokens: entry.inputTokens + entry.outputTokens,
      success: entry.success,
      error_code: entry.errorCode ?? null,
      error_message: entry.errorMessage ?? null,
      duration_ms: entry.durationMs ?? null,
    })
    .then(({ error }) => {
      if (error) {
        console.error('[auditLog] Failed to write log:', error.message)
      }
    })
}

/**
 * Get total tokens used today for a user.
 * Used for per-plan daily token caps.
 */
export async function getDailyTokens(
  supabase: SupabaseClient,
  userId: string
): Promise<number> {
  const startOfDay = new Date()
  startOfDay.setUTCHours(0, 0, 0, 0)

  const { data, error } = await supabase
    .from('ai_audit_logs')
    .select('total_tokens')
    .eq('user_id', userId)
    .eq('success', true)
    .gte('created_at', startOfDay.toISOString())

  if (error) {
    console.error('[auditLog] Failed to fetch daily tokens:', error.message)
    return 0
  }

  return (data ?? []).reduce((sum, row) => sum + (row.total_tokens ?? 0), 0)
}

/** Daily token caps by plan. Prevents one user from draining your account. */
export const DAILY_TOKEN_CAPS: Record<string, number | null> = {
  free: 25_000,      // ~5 average messages
  pro: 500_000,      // ~$1.50/day ceiling at claude-sonnet-4-6 pricing
  premium: null,     // no cap
}
