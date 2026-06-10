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

export async function getDailyAiUsage(userId: string) {
  const { count, error } = await supabaseServer
    .from('ai_usage')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', startOfTodayUtc())

  if (error) console.error('Failed to count AI usage:', error)
  return count ?? 0
}

export async function recordAiUsage(userId: string) {
  const { error } = await supabaseServer.from('ai_usage').insert({ user_id: userId })
  if (error) console.error('Failed to record AI usage:', error)
}

export async function getAiUsageForUser(userId: string) {
  const plan = await getUserPlan(userId)
  const used = await getDailyAiUsage(userId)
  return buildUsageStats(plan, used)
}

export async function canUseAi(userId: string) {
  const stats = await getAiUsageForUser(userId)
  const allowed = stats.unlimited || (stats.remaining ?? 0) > 0
  return { allowed, stats }
}

export { FREE_DAILY_AI_LIMIT }
