'use client'

import type { LucideIcon } from 'lucide-react'
import { CATEGORIES } from '@/lib/constants'
import { useQueryParams } from '@/hooks/useQueryParams'
import { cn } from '@/lib/utils'

export function CategoryPills() {
  const { searchParams, setParams } = useQueryParams()
  const active = searchParams.get('cat')

  const pills: { slug: string | null; label: string; Icon: LucideIcon | null }[] = [
    { slug: null, label: 'Todo', Icon: null },
    ...CATEGORIES.map(c => ({ slug: c.slug as string, label: c.label, Icon: c.Icon })),
  ]

  return (
    <div className="scrollbar-hide -mx-5 flex gap-2 overflow-x-auto px-5">
      {pills.map(pill => {
        const isActive = pill.slug === active || (!pill.slug && !active)
        return (
          <button
            key={pill.label}
            type="button"
            onClick={() => setParams({ cat: pill.slug, size: null })}
            className={cn(
              'flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-[0.85rem] font-medium transition-colors duration-150',
              isActive
                ? 'bg-foreground text-background'
                : 'bg-muted text-muted-foreground hover:text-foreground',
            )}
          >
            {pill.Icon && <pill.Icon className="size-[0.95rem]" strokeWidth={2} />}
            {pill.label}
          </button>
        )
      })}
    </div>
  )
}
