'use client'

import { useEffect, useState } from 'react'
import { supabase } from './supabase'

type Plan = 'free' | 'pro' | 'premium'

type ProfileRow = {
  user_id?: string
  is_pro: boolean
  is_premium: boolean
  plan: Plan
}

export function useProfile() {
  const [profile, setProfile] = useState<ProfileRow | null>(null)
  const [plan, setPlan] = useState<Plan>('free')
  const [isPro, setIsPro] = useState(false)
  const [isPremium, setIsPremium] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (!user || userError) {
        window.location.href = '/landing'
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('is_pro,is_premium,plan')
        .eq('user_id', user.id)
        .maybeSingle() as { data: ProfileRow | null; error: any }

      let currentProfile = data

      if (!currentProfile) {
        const { data: inserted, error: insertError } = await supabase
          .from('profiles')
          .insert({
            user_id: user.id,
            plan: 'free',
            is_pro: false,
            is_premium: false,
          })
          .select()
          .single() as { data: ProfileRow | null; error: any }

        if (insertError) {
          console.error('Failed to create profile:', insertError)
        }

        currentProfile = inserted ?? {
          plan: 'free',
          is_pro: false,
          is_premium: false,
        }
      }

      const premium = currentProfile.is_premium || currentProfile.plan === 'premium'
      const pro = currentProfile.is_pro || premium || currentProfile.plan === 'pro'

      setProfile(currentProfile)
      setIsPremium(premium)
      setIsPro(pro)
      setPlan(currentProfile.plan ?? 'free')
      setLoading(false)
    }

    loadProfile()
  }, [])

  return {
    profile,
    plan,
    isPro,
    isPremium,
    loading,
  }
}
