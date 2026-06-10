import type { SupabaseClient } from '@supabase/supabase-js'

interface AiCallLog {
  userId: string
  route: string
  model: string
  inputTokens: number
  outputTokens: number
  success: boolean
  durationMs: number
  errorCode?: string
  errorMessage?: string
}

export function logAiCall(supabase: SupabaseClient, log: AiCallLog): void {
  supabase
    .from('ai_call_logs')
    .insert({
      user_id: log.userId,
      route: log.route,
      model: log.model,
      input_tokens: log.inputTokens,
      output_tokens: log.outputTokens,
      success: log.success,
      duration_ms: log.durationMs,
      error_code: log.errorCode ?? null,
      error_message: log.errorMessage ?? null,
    })
    .then(() => {})
}
