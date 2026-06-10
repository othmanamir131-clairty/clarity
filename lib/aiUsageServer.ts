import { buildUsageStats, FREE_DAILY_AI_LIMIT, type UserPlan } from './aiLimits'
import { supabaseServer } from './supabaseServer'

function startOfTodayUtc() {
  const date = new Date()
  date.setUTCHours(0, 0, 0, 0)
  return date.toISOString()
}

export async function getUserPlan(userId: string): Promise<UserPlan> {
  const { data } = await supabaseServer
    .from('profiles')
    .select('is_pro, is_premium, plan')
    .eq('user_id', userId)
    .maybeSingle()

  if (data?.is_premium || data?.plan === 'premium') return 'premium'
  if (data?.is_pro || data?.plan === 'pro') return 'pro'
  return 'free'
}

/** Count today's AI messages via ideas saved by /api/chat */
export async function getDailyAiUsage(userId: string) {
  const { count, error } = await supabaseServer
    .from('ideas')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', startOfTodayUtc())

  if (error) {
    console.error('Failed to count daily AI usage:', error)
    return 0
  }

  return count ?? 0
}

export async function getAiUsageForUser(userId: string) {
  const plan = await getUserPlan(userId)
  const used = await getDailyAiUsage(userId)
  return buildUsageStats(plan, used)
}

export async function canUseAi(userId: string) {
  const stats = await getAiUsageForUser(userId)
  const allowed = stats.unlimited || stats.used < FREE_DAILY_AI_LIMIT
  return { allowed, stats }
}

export { FREE_DAILY_AI_LIMIT }
