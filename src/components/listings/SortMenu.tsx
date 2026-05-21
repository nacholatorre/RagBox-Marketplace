'use client'

import { useState } from 'react'
import { ArrowDownUp, Check } from 'lucide-react'
import { SORT_OPTIONS } from '@/lib/constants'
import type { SortKey } from '@/types'
import { useQueryParams } from '@/hooks/useQueryParams'
import { Sheet } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

export function SortMenu() {
  const { searchParams, setParams } = useQueryParams()
  const [open, setOpen] = useState(false)
  const current = (searchParams.get('sort') as SortKey) || 'recientes'

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-9 items-center gap-1.5 rounded-full border border-border bg-background px-3.5 text-[0.85rem] font-medium transition-colors hover:bg-muted"
      >
        <ArrowDownUp className="size-[0.95rem] text-muted-foreground" />
        Ordenar
      </button>

      <Sheet open={open} onClose={() => setOpen(false)} title="Ordenar por">
        <div className="space-y-1 pb-3 pt-1">
          {SORT_OPTIONS.map(opt => {
            const active = opt.key === current
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => {
                  setParams({ sort: opt.key === 'recientes' ? null : opt.key })
                  setOpen(false)
                }}
                className={cn(
                  'flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-[0.95rem] transition-colors',
                  active ? 'bg-muted font-semibold' : 'hover:bg-muted/60',
                )}
              >
                {opt.label}
                {active && <Check className="size-[1.1rem]" />}
              </button>
            )
          })}
        </div>
      </Sheet>
    </>
  )
}
