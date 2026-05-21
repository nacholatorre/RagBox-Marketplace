import { CheckCircle2 } from 'lucide-react'
import type { Listing } from '@/types'
import { categoryIcon, categoryLabel, conditionMeta } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface Props {
  listing: Listing
  className?: string
}

/** Pills premium con tonos suaves. Tono distinto por tipo de dato. */
export function ListingBadges({ listing, className }: Props) {
  const cond = conditionMeta(listing.condition)
  const CategoryIcon = categoryIcon(listing.category)
  const available = listing.status === 'active'

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      <Pill tone="muted">{cond.label}</Pill>
      {listing.size && <Pill tone="blue">Talle {listing.size}</Pill>}
      <Pill tone="primary">
        <CategoryIcon className="size-[0.85rem]" strokeWidth={2} />
        {categoryLabel(listing.category)}
      </Pill>
      {available && (
        <Pill tone="emerald">
          <CheckCircle2 className="size-[0.85rem]" strokeWidth={2.2} />
          Disponible
        </Pill>
      )}
    </div>
  )
}

type Tone = 'muted' | 'blue' | 'primary' | 'emerald'

function Pill({ children, tone }: { children: React.ReactNode; tone: Tone }) {
  const toneClass: Record<Tone, string> = {
    muted: 'bg-muted text-foreground/80 ring-1 ring-inset ring-border/60',
    blue: 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-100',
    primary: 'bg-primary/10 text-primary ring-1 ring-inset ring-primary/15',
    emerald: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-100',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.78rem] font-semibold tracking-tight',
        toneClass[tone],
      )}
    >
      {children}
    </span>
  )
}
