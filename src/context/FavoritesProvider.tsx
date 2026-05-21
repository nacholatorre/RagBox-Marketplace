'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useSupabase } from '@/context/SupabaseProvider'

interface FavoritesContextValue {
  ids: Set<string>
  ready: boolean
  isFavorite: (listingId: string) => boolean
  /** Alterna el favorito. Devuelve el nuevo estado, o null si no hay sesión. */
  toggle: (listingId: string) => Promise<boolean | null>
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null)

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { supabase, session } = useSupabase()
  const userId = session?.user.id
  const [ids, setIds] = useState<Set<string>>(new Set())
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!userId) {
      setIds(new Set())
      setReady(true)
      return
    }
    setReady(false)
    supabase
      .from('favorites')
      .select('listing_id')
      .eq('user_id', userId)
      .then(({ data }) => {
        setIds(new Set((data ?? []).map(r => r.listing_id as string)))
        setReady(true)
      })
  }, [userId, supabase])

  async function toggle(listingId: string): Promise<boolean | null> {
    if (!userId) return null
    const has = ids.has(listingId)

    // Optimista
    setIds(prev => {
      const next = new Set(prev)
      if (has) next.delete(listingId)
      else next.add(listingId)
      return next
    })

    try {
      if (has) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', userId)
          .eq('listing_id', listingId)
      } else {
        await supabase
          .from('favorites')
          .insert({ user_id: userId, listing_id: listingId })
      }
    } catch {
      // Revertir si falla
      setIds(prev => {
        const next = new Set(prev)
        if (has) next.add(listingId)
        else next.delete(listingId)
        return next
      })
      return has
    }
    return !has
  }

  return (
    <FavoritesContext.Provider
      value={{ ids, ready, isFavorite: id => ids.has(id), toggle }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites debe usarse dentro de <FavoritesProvider>')
  return ctx
}
