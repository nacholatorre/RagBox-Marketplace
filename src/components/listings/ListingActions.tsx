'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { Listing } from '@/types'
import { buildContactUrl } from '@/lib/whatsapp'
import { trackEvent } from '@/lib/track'
import { useAuth } from '@/hooks/useAuth'
import { FavoriteButton } from './FavoriteButton'

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.518 5.26l-.999 3.648 3.97-1.717zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  )
}

export function ListingActions({
  listing,
  schoolName,
}: {
  listing: Listing
  schoolName: string
}) {
  const { user, isAuthed, supabase } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const isOwner = !!user && user.id === listing.seller_id
  const isMessage = listing.type !== 'sell'
  const unavailable =
    listing.status === 'sold' || listing.status === 'fulfilled'

  const ctaLabel = isMessage
    ? 'Responder por WhatsApp'
    : 'Contactar por WhatsApp'

  const unavailableLabel = isMessage
    ? 'Este mensaje ya no está activo'
    : 'Este artículo ya no está disponible'

  /** Bloquea el contacto a usuarios sin sesión y trackea al resto. */
  function handleContactClick(e: React.MouseEvent) {
    if (!isAuthed) {
      e.preventDefault()
      toast('Iniciá sesión para contactar por WhatsApp')
      router.push(`/login?next=${encodeURIComponent(pathname)}`)
      return
    }
    const action =
      listing.type === 'request'
        ? 'request_i_have_this'
        : listing.type === 'donation'
          ? 'donation_interested'
          : 'general_contact'
    trackEvent(supabase, {
      event_name: 'click_whatsapp',
      listing_id: listing.id,
      seller_id: listing.seller_id,
      school_id: listing.school_id,
      user_id: user?.id ?? null,
      metadata: {
        listing_title: listing.title,
        listing_type: listing.type,
        category: listing.category,
        whatsapp_action: action,
        page_source: 'listing_detail',
      },
    })
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-2xl border-t border-border bg-background/95 px-5 pt-3 pb-safe backdrop-blur-xl">
      <div className="flex items-center gap-2.5 pb-3">
        {isOwner ? (
          <Link
            href="/mis-publicaciones"
            className="flex h-14 w-full items-center justify-center rounded-full bg-primary text-[0.95rem] font-semibold text-primary-foreground transition-transform active:scale-[0.98]"
          >
            Gestionar tu publicación
          </Link>
        ) : unavailable ? (
          <div className="flex h-14 w-full items-center justify-center rounded-full bg-muted text-[0.95rem] font-medium text-muted-foreground">
            {unavailableLabel}
          </div>
        ) : (
          <>
            <FavoriteButton
              listingId={listing.id}
              variant="plain"
              className="size-14 shrink-0"
            />
            <a
              href={buildContactUrl(listing, schoolName)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleContactClick}
              className="flex h-14 flex-1 items-center justify-center gap-2.5 rounded-full bg-whatsapp text-[0.95rem] font-semibold text-whatsapp-foreground transition-transform active:scale-[0.98]"
            >
              <WhatsAppGlyph className="size-[1.15rem]" />
              {ctaLabel}
            </a>
          </>
        )}
      </div>
    </div>
  )
}
