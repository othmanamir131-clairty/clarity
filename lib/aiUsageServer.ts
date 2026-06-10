import type { SupabaseClient } from '@supabase/supabase-js'
import { buildUsageStats, FREE_DAILY_AI_LIMIT, type UserPlan } from './aiLimits'

function startOfTodayUtc() {
  const date = new Date()
  date.setUTCHours(0, 0, 0, 0)
  return date.toISOString()
}

export async function getUserPlan(
  supabase: SupabaseClient,
  userId: string
): Promise<UserPlan> {
  const { data } = await supabase
    .from('profiles')
    .select('is_pro, is_premium, plan')
    .eq('user_id', userId)
    .maybeSingle()

  if (data?.is_premium || data?.plan === 'premium') return 'premium'
  if (data?.is_pro || data?.plan === 'pro') return 'pro'
  return 'free'
}

/** Each /api/chat call saves one idea — count those for today's usage. */
async function getIdeasUsageToday(supabase: SupabaseClient, userId: string) {
  const { count, error } = await supabase
    .from('ideas')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', startOfTodayUtc())

  if (error) {
    console.error('Failed to count ideas for AI usage:', error)
    return 0
  }

  return count ?? 0
}

export async function getDailyAiUsage(supabase: SupabaseClient, userId: string) {
  return getIdeasUsageToday(supabase, userId)
}

export async function incrementAiUsage(supabase: SupabaseClient, userId: string) {
  return getIdeasUsageToday(supabase, userId)
}

export async function getAiUsageForUser(supabase: SupabaseClient, userId: string) {
  const plan = await getUserPlan(supabase, userId)
  const used = await getDailyAiUsage(supabase, userId)
  return buildUsageStats(plan, used)
}

export async function canUseAi(supabase: SupabaseClient, userId: string) {
  const stats = await getAiUsageForUser(supabase, userId)
  const allowed = stats.unlimited || stats.used < FREE_DAILY_AI_LIMIT
  return { allowed, stats }
}

export { FREE_DAILY_AI_LIMIT }
