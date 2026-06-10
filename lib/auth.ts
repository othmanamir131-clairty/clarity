import { supabase } from './supabase'

export function getAuthConfirmUrl() {
  const base =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ||
    (typeof window !== 'undefined' ? window.location.origin : '')
  return `${base}/auth/confirm`
}

export async function getPostAuthPath(): Promise<string> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return '/login'

  const { data: profile } = await supabase
    .from('profiles')
    .select('onboarded')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!profile?.onboarded) return '/onboarding'
  return '/'
}
