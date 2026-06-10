export const FREE_DAILY_AI_LIMIT = 5

export type UserPlan = 'free' | 'pro' | 'premium'

export type AiUsageStats = {
  plan: UserPlan
  used: number
  limit: number | null
  remaining: number | null
  unlimited: boolean
}

export function buildUsageStats(plan: UserPlan, used: number): AiUsageStats {
  if (plan !== 'free') {
    return { plan, used, limit: null, remaining: null, unlimited: true }
  }

  return {
    plan,
    used,
    limit: FREE_DAILY_AI_LIMIT,
    remaining: Math.max(0, FREE_DAILY_AI_LIMIT - used),
    unlimited: false,
  }
}

export function dailyLimitMessage() {
  return `You've used all ${FREE_DAILY_AI_LIMIT} free AI messages for today. Upgrade to Pro for unlimited AI — your limit resets tomorrow!`
}
