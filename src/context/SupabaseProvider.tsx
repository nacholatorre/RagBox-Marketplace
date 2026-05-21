'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types'

type SupabaseClient = ReturnType<typeof createClient>

interface SupabaseContextValue {
  supabase: SupabaseClient
  session: Session | null
  profile: Profile | null
  loading: boolean
  refreshProfile: () => Promise<void>
}

const SupabaseContext = createContext<SupabaseContextValue | null>(null)

export function SupabaseProvider({
  initialSession,
  children,
}: {
  initialSession: Session | null
  children: React.ReactNode
}) {
  const [supabase] = useState<SupabaseClient>(() => createClient())
  const [session, setSession] = useState<Session | null>(initialSession)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  async function loadProfile(userId: string | undefined) {
    if (!userId) {
      setProfile(null)
      return
    }
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()
    setProfile((data as Profile) ?? null)
  }

  useEffect(() => {
    loadProfile(initialSession?.user.id).finally(() => setLoading(false))

    const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      loadProfile(newSession?.user.id)
    })
    return () => data.subscription.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase])

  async function refreshProfile() {
    await loadProfile(session?.user.id)
  }

  return (
    <SupabaseContext.Provider
      value={{ supabase, session, profile, loading, refreshProfile }}
    >
      {children}
    </SupabaseContext.Provider>
  )
}

export function useSupabase() {
  const ctx = useContext(SupabaseContext)
  if (!ctx) throw new Error('useSupabase debe usarse dentro de <SupabaseProvider>')
  return ctx
}
