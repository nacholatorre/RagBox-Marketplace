import Link from 'next/link'
import Image from 'next/image'
import type { Listing } from '@/types'
import { formatPrice } from '@/lib/formatters'
import { categoryIcon } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface Props {
  title: string
  listings: Listing[]
  schoolSlug: string
}

/** Carrousel horizontal de avisos relacionados. Cards compactas, snap. */
export function RelatedListingsCarousel({ title, listings, schoolSlug }: Props) {
  if (listings.length === 0) return null

  return (
    <section className="-mx-5">
      <h2 className="px-5 text-[0.95rem] font-semibold tracking-tight">{title}</h2>
      <div className="scrollbar-hide mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1">
        {listings.map(l => (
          <RelatedCard key={l.id} listing={l} schoolSlug={schoolSlug} />
        ))}
      </div>
    </section>
  )
}

function RelatedCard({
  listing,
  schoolSlug,
}: {
  listing: Listing
  schoolSlug: string
}) {
  const image = listing.images?.[0]
  const FallbackIcon = categoryIcon(listing.category)
  const dim = listing.status === 'sold'

  return (
    <Link
      href={`/${schoolSlug}/${listing.id}`}
      className="group relative w-[150px] shrink-0 snap-start"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-muted">
        {image ? (
          <Image
            src={image}
            alt={listing.title}
            fill
            sizes="160px"
            className={cn(
              'object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]',
              dim && 'opacity-70',
            )}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <FallbackIcon
              className="size-8 text-muted-foreground/35"
              strokeWidth={1.5}
            />
          </div>
        )}
      </div>
      <div className="mt-2 px-0.5">
        <p className="text-[0.92rem] font-bold tracking-tight text-primary">
          {formatPrice(listing.price, listing.price_mode)}
        </p>
        <p className="mt-0.5 line-clamp-1 text-[0.78rem] font-medium leading-snug text-foreground">
          {listing.title}
        </p>
        {listing.size && (
          <p className="mt-0.5 text-[0.7rem] text-muted-foreground">
            Talle {listing.size}
          </p>
        )}
      </div>
    </Link>
  )
}
