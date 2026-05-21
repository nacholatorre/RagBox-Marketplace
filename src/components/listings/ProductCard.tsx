import Link from 'next/link'
import Image from 'next/image'
import type { Listing } from '@/types'
import { formatPrice } from '@/lib/formatters'
import { conditionMeta, categoryIcon } from '@/lib/constants'
import { FavoriteButton } from './FavoriteButton'
import { StatusBadge } from './StatusBadge'
import { cn } from '@/lib/utils'

interface Props {
  listing: Listing
  schoolSlug: string
}

/** Quita "talle X" del título si ya está el size — evita "Chomba talle 10" + "Talle 10". */
function cleanTitle(title: string, size: string | null): string {
  if (!size) return title
  return title.replace(/\s*[·•\-—,]?\s*talle\s+[a-z0-9]+\b/gi, '').trim()
}

/** Tarjeta de un aviso de venta en el marketplace. */
export function ProductCard({ listing, schoolSlug }: Props) {
  const image = listing.images?.[0]
  const dim = listing.status === 'sold'
  const cond = conditionMeta(listing.condition)
  const FallbackIcon = categoryIcon(listing.category)
  const title = cleanTitle(listing.title, listing.size)
  const detail = [listing.size && `Talle ${listing.size}`, cond.label]
    .filter(Boolean)
    .join(' · ')

  return (
    <div className="group relative">
      <Link href={`/${schoolSlug}/${listing.id}`} className="block">
        <div className="relative overflow-hidden rounded-[1.4rem] bg-muted transition-transform duration-200 ease-out group-active:scale-[0.97]">
          <div className="relative aspect-[4/5]">
            {image ? (
              <Image
                src={image}
                alt={title}
                fill
                sizes="(max-width: 640px) 50vw, 240px"
                className={cn(
                  'object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]',
                  dim && 'opacity-70',
                )}
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <FallbackIcon
                  className="size-9 text-muted-foreground/35"
                  strokeWidth={1.5}
                />
              </div>
            )}
          </div>
        </div>

        <div className="mt-2.5 px-0.5">
          <p className="text-[1rem] font-bold tracking-tight text-whatsapp">
            {formatPrice(listing.price, listing.price_mode)}
          </p>
          <p className="mt-0.5 line-clamp-1 text-[0.85rem] font-medium leading-snug">
            {title}
          </p>
          <p className="mt-0.5 text-[0.72rem] text-muted-foreground">{detail}</p>
        </div>
      </Link>

      {/* Overlays fuera del <a> — evita anidar elementos interactivos */}
      <StatusBadge
        status={listing.status}
        expiresAt={listing.expires_at}
        className="pointer-events-none absolute left-2.5 top-2.5"
      />
      <FavoriteButton
        listingId={listing.id}
        className="absolute right-2.5 top-2.5 z-10"
      />
    </div>
  )
}
