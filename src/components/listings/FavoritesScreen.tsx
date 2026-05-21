'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import type { Listing } from '@/types'
import { useFavorites } from '@/context/FavoritesProvider'
import { useSupabase } from '@/context/SupabaseProvider'
import { ProductCard } from '@/components/listings/ProductCard'
import { ProductGridSkeleton } from '@/components/listings/ProductCardSkeleton'
import { EmptyState } from '@/components/common/EmptyState'

type FavListing = Listing & { school: { slug: string } | null }

const SHOP_HREF = '/wellspring-ba'

export function FavoritesScreen() {
  const { ids, ready } = useFavorites()
  const { supabase } = useSupabase()
  const [listings, setListings] = useState<FavListing[] | null>(null)

  useEffect(() => {
    if (!ready) return
    const arr = [...ids]
    if (arr.length === 0) {
      setListings([])
      return
    }
    supabase
      .from('listings')
      .select('*, school:schools(slug)')
      .in('id', arr)
      .order('created_at', { ascending: false })
      .then(({ data }) => setListings((data as FavListing[]) ?? []))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready])

  if (listings === null) {
    return (
      <div className="px-4 py-4">
        <ProductGridSkeleton count={4} />
      </div>
    )
  }

  // Se filtra por `ids` para que al quitar un favorito desaparezca al instante.
  const visible = listings.filter(l => ids.has(l.id))

  if (visible.length === 0) {
    return (
      <EmptyState
        icon={<Heart className="size-7" strokeWidth={1.7} />}
        title="Todavía no guardaste productos"
        description="Tocá el corazón en un producto para verlo acá después."
        action={
          <Link
            href={SHOP_HREF}
            className="inline-flex h-12 items-center rounded-full bg-primary px-6 text-[0.95rem] font-semibold text-primary-foreground transition-transform active:scale-[0.97]"
          >
            Explorar productos
          </Link>
        }
      />
    )
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-7 px-5 py-4 sm:grid-cols-3">
        {visible.map(listing => (
          <ProductCard
            key={listing.id}
            listing={listing}
            schoolSlug={listing.school?.slug ?? ''}
          />
        ))}
      </div>

      {/* Cuando hay pocos favoritos, evitamos la sensación de pantalla vacía */}
      {visible.length <= 3 && (
        <div className="mx-5 mb-10 mt-6 rounded-2xl border border-border px-5 py-6 text-center">
          <p className="text-[0.9rem] font-medium">
            Seguí explorando productos del cole.
          </p>
          <Link
            href={SHOP_HREF}
            className="mt-3 inline-flex h-11 items-center rounded-full border border-border px-5 text-[0.88rem] font-semibold text-foreground transition-colors hover:bg-muted"
          >
            Ver productos
          </Link>
        </div>
      )}
    </div>
  )
}
