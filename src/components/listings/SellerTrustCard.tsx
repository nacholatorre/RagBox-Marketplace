import { ShieldCheck } from 'lucide-react'
import type { Listing, School } from '@/types'
import { formatRelativeDate } from '@/lib/formatters'

interface Props {
  listing: Listing
  school: School
  activeCount: number
}

/**
 * Card de vendedor — avatar con inicial, nombre, familia del colegio,
 * publicaciones activas y antigüedad del aviso. Sin estrellas ni reseñas.
 */
export function SellerTrustCard({ listing, school, activeCount }: Props) {
  const initial = (listing.seller_name?.charAt(0) ?? '?').toUpperCase()
  const activeLabel =
    activeCount === 1 ? '1 publicación activa' : `${activeCount} publicaciones activas`

  return (
    <section>
      <h2 className="text-[0.95rem] font-semibold tracking-tight">Vendedor</h2>
      <div className="mt-2.5 flex items-center gap-4 rounded-3xl border border-border/70 bg-background p-4 shadow-[0_2px_12px_-6px_oklch(0.22_0.05_255_/_0.12)]">
        <div className="relative shrink-0">
          <div className="flex size-12 items-center justify-center rounded-full bg-foreground text-[1.05rem] font-semibold text-background">
            {initial}
          </div>
          <span
            aria-hidden
            className="absolute -bottom-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full bg-emerald-500 text-background ring-2 ring-background"
          >
            <ShieldCheck className="size-3" strokeWidth={2.4} />
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[0.95rem] font-semibold text-foreground">
            {listing.seller_name}
          </p>
          <p className="mt-0.5 truncate text-[0.78rem] text-muted-foreground">
            Familia de {school.name}
          </p>
          <p className="mt-1 truncate text-[0.74rem] font-medium text-muted-foreground/90">
            <span className="text-foreground/75">{activeLabel}</span>
            <span className="mx-1.5 text-border">·</span>
            Publicó {formatRelativeDate(listing.created_at)}
          </p>
        </div>
      </div>
    </section>
  )
}
