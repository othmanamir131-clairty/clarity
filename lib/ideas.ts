import { supabase } from './supabase'

export async function getCurrentUserId(): Promise<string | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user?.id ?? null
}

export async function fetchUserIdeas(limit?: number) {
  const userId = await getCurrentUserId()
  if (!userId) return []

  let query = supabase
    .from('ideas')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (limit) query = query.limit(limit)

  const { data, error } = await query
  if (error) {
    console.error('Failed to fetch ideas:', error)
    return []
  }

  return data ?? []
}

export async function countUserIdeas(): Promise<number> {
  const userId = await getCurrentUserId()
  if (!userId) return 0

  const { count, error } = await supabase
    .from('ideas')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  if (error) {
    console.error('Failed to count ideas:', error)
    return 0
  }

  return count ?? 0
}
