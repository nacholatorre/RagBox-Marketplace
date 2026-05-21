import { Sparkles, Ruler, Tag, Clock } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { Listing } from '@/types'
import { categoryLabel, conditionMeta } from '@/lib/constants'
import { formatRelativeDate } from '@/lib/formatters'

interface Props {
  listing: Listing
}

/** Card "Detalles" — 4 filas con icono fino + label + valor. */
export function ListingDetailsCard({ listing }: Props) {
  const cond = conditionMeta(listing.condition)

  const rows: { icon: LucideIcon; label: string; value: string }[] = [
    { icon: Sparkles, label: 'Estado', value: cond.label },
  ]
  if (listing.size) {
    rows.push({ icon: Ruler, label: 'Talle', value: listing.size })
  }
  rows.push({
    icon: Tag,
    label: 'Categoría',
    value: categoryLabel(listing.category),
  })
  rows.push({
    icon: Clock,
    label: 'Publicado',
    value: formatRelativeDate(listing.created_at),
  })

  return (
    <section>
      <h2 className="text-[0.95rem] font-semibold tracking-tight">Detalles</h2>
      <div className="mt-2.5 rounded-3xl border border-border/70 bg-background p-2 shadow-[0_2px_12px_-6px_oklch(0.22_0.05_255_/_0.12)]">
        <ul className="divide-y divide-border/60">
          {rows.map(({ icon: Icon, label, value }) => (
            <li
              key={label}
              className="flex items-center justify-between gap-4 px-3 py-3.5"
            >
              <div className="flex items-center gap-2.5 text-muted-foreground">
                <Icon className="size-[1.05rem]" strokeWidth={1.7} />
                <span className="text-[0.85rem] font-medium">{label}</span>
              </div>
              <span className="text-[0.88rem] font-semibold text-foreground">
                {value}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
