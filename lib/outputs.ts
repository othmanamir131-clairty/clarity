import { supabase } from './supabase'
import { getCurrentUserId } from './ideas'

export type OutputType = 'spreadsheet' | 'brief' | 'schedule_post'

export type UserOutput = {
  id: string
  user_id: string
  type: OutputType
  title: string | null
  payload: Record<string, unknown>
  created_at: string
}

export async function saveOutput(
  type: OutputType,
  title: string,
  payload: Record<string, unknown>
) {
  const userId = await getCurrentUserId()
  if (!userId) return { data: null, error: new Error('Not authenticated') }

  const { data, error } = await supabase
    .from('outputs')
    .insert({ user_id: userId, type, title, payload })
    .select()
    .single()

  return { data: data as UserOutput | null, error }
}

export async function fetchOutputs(type?: OutputType, limit?: number) {
  const userId = await getCurrentUserId()
  if (!userId) return []

  let query = supabase
    .from('outputs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (type) query = query.eq('type', type)
  if (limit) query = query.limit(limit)

  const { data, error } = await query
  if (error) {
    console.error('Failed to fetch outputs:', error)
    return []
  }

  return (data ?? []) as UserOutput[]
}

export async function countOutputs(type?: OutputType) {
  const userId = await getCurrentUserId()
  if (!userId) return 0

  let query = supabase
    .from('outputs')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  if (type) query = query.eq('type', type)

  const { count, error } = await query
  if (error) {
    console.error('Failed to count outputs:', error)
    return 0
  }

  return count ?? 0
}

export async function deleteOutput(id: string) {
  const userId = await getCurrentUserId()
  if (!userId) return { error: new Error('Not authenticated') }

  const { error } = await supabase
    .from('outputs')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  return { error }
}
