'use client'

import { useQueryParams } from '@/hooks/useQueryParams'
import { cn } from '@/lib/utils'

const TABS = [
  { key: 'todo', label: 'Todo' },
  { key: 'busco', label: 'Busco' },
  { key: 'dono', label: 'Dono' },
  { key: 'avisos', label: 'Avisos' },
] as const

type TabKey = (typeof TABS)[number]['key']

/** Chips horizontales para filtrar el Tablón por tipo de mensaje. */
export function TablonFilters() {
  const { searchParams, setParams } = useQueryParams()
  const raw = searchParams.get('tab')
  const active: TabKey = TABS.some(t => t.key === raw) ? (raw as TabKey) : 'todo'

  return (
    <div className="scrollbar-hide flex gap-2 overflow-x-auto">
      {TABS.map(tab => {
        const isActive = active === tab.key
        return (
          <button
            key={tab.key}
            type="button"
            aria-pressed={isActive}
            onClick={() => setParams({ tab: tab.key === 'todo' ? null : tab.key })}
            className={cn(
              'shrink-0 rounded-full px-4 py-1.5 text-[0.85rem] font-semibold transition-colors',
              isActive
                ? 'bg-foreground text-background'
                : 'bg-muted text-muted-foreground hover:text-foreground',
            )}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
