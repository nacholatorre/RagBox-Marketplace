'use client'

import { useRouter } from 'next/navigation'
import { useSupabase } from '@/context/SupabaseProvider'

/** Acceso conveniente a la sesión, el perfil y acciones de auth. */
export function useAuth() {
  const { supabase, session, profile, loading, refreshProfile } = useSupabase()
  const router = useRouter()

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return {
    supabase,
    session,
    profile,
    loading,
    user: session?.user ?? null,
    isAuthed: !!session,
    /** El perfil tiene los datos mínimos para publicar/chatear. */
    profileComplete: !!profile?.full_name && !!profile?.whatsapp,
    signOut,
    refreshProfile,
  }
}
