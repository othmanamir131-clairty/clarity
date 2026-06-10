import { supabase } from './supabase'

type AuthUser = {
  id: string
  email?: string | null
  user_metadata?: Record<string, unknown>
}

type ProfileOnboarding = {
  onboarded?: boolean | null
  display_name?: string | null
}

export function isUserOnboarded(
  user: AuthUser | null | undefined,
  profile?: ProfileOnboarding | null
): boolean {
  if (!user) return false
  if (user.user_metadata?.onboarded === true) return true
  return profile?.onboarded === true
}

export async function completeOnboarding({
  userId,
  email,
  displayName,
  creatorType,
}: {
  userId: string
  email?: string | null
  displayName: string
  creatorType: string
}) {
  const resolvedName = displayName.trim() || email?.split('@')[0] || 'Creator'

  const { error: authError } = await supabase.auth.updateUser({
    data: {
      display_name: resolvedName,
      creator_type: creatorType,
      onboarded: true,
    },
  })

  if (authError) {
    return { ok: false as const, error: authError.message }
  }

  const { error: profileError } = await supabase.from('profiles').upsert(
    {
      user_id: userId,
      display_name: resolvedName,
      creator_type: creatorType,
      onboarded: true,
      plan: 'free',
      is_pro: false,
      is_premium: false,
    },
    { onConflict: 'user_id' }
  )

  return {
    ok: true as const,
    displayName: resolvedName,
    profileWarning: profileError?.message,
  }
}
