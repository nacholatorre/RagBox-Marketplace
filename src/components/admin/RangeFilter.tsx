import Link from 'next/link'
import type { AdminRange } from '@/lib/queries'
import { cn } from '@/lib/utils'

const OPTIONS: { value: AdminRange; label: string }[] = [
  { value: 'today', label: 'Hoy' },
  { value: '7d', label: '7 días' },
  { value: '30d', label: '30 días' },
  { value: 'all', label: 'Todo' },
]

export function RangeFilter({ active }: { active: AdminRange }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {OPTIONS.map(o => {
        const isActive = o.value === active
        return (
          <Link
            key={o.value}
            href={`/admin?range=${o.value}`}
            className={cn(
              'rounded-full px-3.5 py-1.5 text-[0.82rem] font-semibold transition-colors',
              isActive
                ? 'bg-foreground text-background'
                : 'bg-muted text-muted-foreground hover:text-foreground',
            )}
          >
            {o.label}
          </Link>
        )
      })}
    </div>
  )
}
