'use client'

import { useState } from 'react'
import { PackageOpen } from 'lucide-react'
import type { Listing } from '@/types'
import { cn } from '@/lib/utils'
import { ProductGrid } from './ProductGrid'
import { PostCard } from './PostCard'

type TabKey = 'activas' | 'cerradas' | 'busco'

interface Props {
  listings: Listing[]
  schoolSlug: string
  sellerName: string
}

export function SellerListingsTabs({ listings, schoolSlug, sellerName }: Props) {
  const [tab, setTab] = useState<TabKey>('activas')

  const sells = listings.filter(l => l.type === 'sell')
  const activas = sells.filter(l => l.status === 'active' || l.status === 'reserved')
  const cerradas = listings.filter(
    l =>
      (l.type === 'sell' && (l.status === 'sold' || l.status === 'paused')) ||
      (l.type === 'donation' && l.status === 'fulfilled'),
  )
  const busco = listings.filter(l => l.type === 'request')

  const groups: Record<TabKey, { label: string; items: Listing[] }> = {
    activas: { label: 'Activas', items: activas },
    cerradas: { label: 'Cerradas', items: cerradas },
    busco: { label: 'Busco', items: busco },
  }

  const current = groups[tab]

  return (
    <section>
      <div className="flex gap-1.5">
        {(Object.keys(groups) as TabKey[]).map(k => {
          const isActive = tab === k
          return (
            <button
              key={k}
              type="button"
              onClick={() => setTab(k)}
              className={cn(
                'rounded-full px-3.5 py-1.5 text-[0.82rem] font-semibold transition-colors',
                isActive
                  ? 'bg-foreground text-background'
                  : 'bg-muted text-muted-foreground hover:text-foreground',
              )}
            >
              {groups[k].label}
              <span className="ml-1.5 tabular-nums opacity-70">{groups[k].items.length}</span>
            </button>
          )
        })}
      </div>

      <div className="mt-4">
        {current.items.length === 0 ? (
          <EmptyTab tabKey={tab} sellerName={sellerName} />
        ) : tab === 'busco' ? (
          <div className="space-y-2">
            {current.items.map(l => (
              <PostCard key={l.id} post={l} schoolSlug={schoolSlug} />
            ))}
          </div>
        ) : (
          <ProductGrid listings={current.items} schoolSlug={schoolSlug} />
        )}
      </div>
    </section>
  )
}

function EmptyTab({ tabKey, sellerName }: { tabKey: TabKey; sellerName: string }) {
  const first = sellerName.split(' ')[0]
  const copy: Record<TabKey, { title: string; text: string }> = {
    activas: {
      title: 'Esta familia no tiene publicaciones activas',
      text: 'Podés volver más tarde o explorar otros avisos de Wellspring.',
    },
    cerradas: {
      title: 'Todavía no hay productos vendidos o donados',
      text: `${first} no marcó ninguna publicación como cerrada todavía.`,
    },
    busco: {
      title: 'Sin mensajes de "Busco" todavía',
      text: `${first} no publicó pedidos en el Tablón.`,
    },
  }
  const c = copy[tabKey]
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-border py-10 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <PackageOpen className="size-5" strokeWidth={1.6} />
      </span>
      <p className="mt-3 text-[0.92rem] font-semibold tracking-tight">{c.title}</p>
      <p className="mt-1 max-w-[18rem] text-[0.8rem] text-muted-foreground">{c.text}</p>
    </div>
  )
}
