'use client'

import { useEffect, useRef } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { trackEvent } from '@/lib/track'

interface Props {
  listingId: string
  sellerId: string | null
  schoolId: string
  category: string
  listingType: string
}

/** Componente invisible — dispara un evento view_listing al montar. */
export function ListingViewTracker({
  listingId,
  sellerId,
  schoolId,
  category,
  listingType,
}: Props) {
  const { user, supabase } = useAuth()
  const fired = useRef(false)

  useEffect(() => {
    if (fired.current) return
    fired.current = true
    trackEvent(supabase, {
      event_name: 'view_listing',
      listing_id: listingId,
      seller_id: sellerId,
      school_id: schoolId,
      user_id: user?.id ?? null,
      metadata: { category, listing_type: listingType },
    })
  }, [supabase, user, listingId, sellerId, schoolId, category, listingType])

  return null
}
