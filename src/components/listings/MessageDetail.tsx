import Image from 'next/image'
import { Clock } from 'lucide-react'
import type { Listing, School } from '@/types'
import { formatRelativeDate } from '@/lib/formatters'
import { cn } from '@/lib/utils'
import { AppHeader } from '@/components/layout/AppHeader'
import { ListingActions } from './ListingActions'
import { ShareListingButton } from './ShareListingButton'
import { ListingComments } from './ListingComments'
import { postTagMeta } from './PostCard'

/** Detalle de un mensaje del Tablón: texto + foto(s) + contacto por WhatsApp. */
export function MessageDetail({
  listing,
  school,
}: {
  listing: Listing
  school: School
}) {
  const images = listing.images ?? []
  const tag = postTagMeta(listing.type)

  return (
    <div className="relative">
      <AppHeader
        title="Mensaje"
        backHref={`/${school.slug}/tablon`}
        right={<ShareListingButton listing={listing} schoolName={school.name} />}
      />

      <div className="px-5 pb-28 pt-3">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-full bg-foreground text-[0.95rem] font-semibold text-background">
            {listing.seller_name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              {tag && (
                <span
                  className={cn(
                    'rounded-md px-1.5 py-0.5 text-[0.65rem] font-bold tracking-[0.04em]',
                    tag.className,
                  )}
                >
                  {tag.label}
                </span>
              )}
              <p className="truncate text-[0.95rem] font-semibold">
                {listing.seller_name}
              </p>
            </div>
            <p className="mt-0.5 flex items-center gap-1 text-[0.75rem] text-muted-foreground">
              <Clock className="size-3" />
              Publicado {formatRelativeDate(listing.created_at)}
            </p>
          </div>
        </div>

        <p className="mt-4 whitespace-pre-wrap break-words text-[1.05rem] leading-relaxed">
          {listing.title}
        </p>

        {images.length > 0 && (
          <div className="mt-4 space-y-2.5">
            {images.map((src, i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded-[1.4rem] bg-muted"
              >
                <Image
                  src={src}
                  alt=""
                  width={800}
                  height={800}
                  sizes="(max-width: 640px) 100vw, 640px"
                  className="h-auto w-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        <ListingComments listingId={listing.id} />
      </div>

      <ListingActions listing={listing} schoolName={school.name} />
    </div>
  )
}
