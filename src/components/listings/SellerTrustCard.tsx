import Link from 'next/link'
import { ChevronRight, ShieldCheck } from 'lucide-react'
import type { Listing, School } from '@/types'
import { formatRelativeDate } from '@/lib/formatters'
import { SellerAvatar } from './SellerAvatar'

interface Props {
  listing: Listing
  school: School
  activeCount: number
}

/**
 * Card de vendedor — avatar con inicial, nombre, familia del colegio,
 * publicaciones activas y antigüedad del aviso. Sin estrellas ni reseñas.
 * Si el listing tiene seller_id, lleva al perfil público de la familia.
 */
export function SellerTrustCard({ listing, school, activeCount }: Props) {
  const activeLabel =
    activeCount === 1 ? '1 publicación activa' : `${activeCount} publicaciones activas`

  const innerContent = (
    <>
      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          <SellerAvatar
            name={listing.seller_name}
            avatarUrl={listing.seller?.avatar_url}
            size={48}
          />
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
    </>
  )

  return (
    <section>
      <h2 className="text-[0.95rem] font-semibold tracking-tight">Vendedor</h2>
      {listing.seller_id ? (
        <Link
          href={`/${school.slug}/vendedores/${listing.seller_id}`}
          className="mt-2.5 block rounded-3xl border border-border/70 bg-background p-4 shadow-[0_2px_12px_-6px_oklch(0.22_0.05_255_/_0.12)] transition-colors hover:bg-muted/50 active:scale-[0.99]"
        >
          {innerContent}
          <p className="mt-3 flex items-center gap-1 text-[0.78rem] font-semibold text-primary">
            Ver perfil y publicaciones
            <ChevronRight className="size-3.5" strokeWidth={2.4} />
          </p>
        </Link>
      ) : (
        <div className="mt-2.5 rounded-3xl border border-border/70 bg-background p-4 shadow-[0_2px_12px_-6px_oklch(0.22_0.05_255_/_0.12)]">
          {innerContent}
        </div>
      )}
    </section>
  )
}
