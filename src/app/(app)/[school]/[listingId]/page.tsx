import { notFound } from 'next/navigation'
import {
  getSchoolBySlug,
  getListing,
  getRelatedListings,
  getSellerActiveListingsCount,
  getSellerRating,
} from '@/lib/queries'
import { formatPrice, isExpired } from '@/lib/formatters'
import { FadeIn } from '@/components/ui/motion'
import { FavoriteButton } from '@/components/listings/FavoriteButton'
import { ShareListingButton } from '@/components/listings/ShareListingButton'
import { StatusBadge } from '@/components/listings/StatusBadge'
import { ListingHeroGallery } from '@/components/listings/ListingHeroGallery'
import { ListingBadges } from '@/components/listings/ListingBadges'
import { ListingDetailsCard } from '@/components/listings/ListingDetailsCard'
import { SellerTrustCard } from '@/components/listings/SellerTrustCard'
import { SellerRating } from '@/components/listings/SellerRating'
import { QuickWhatsAppQuestions } from '@/components/listings/QuickWhatsAppQuestions'
import { ListingSecondaryActions } from '@/components/listings/ListingSecondaryActions'
import { RelatedListingsCarousel } from '@/components/listings/RelatedListingsCarousel'
import { StickyWhatsAppCTA } from '@/components/listings/StickyWhatsAppCTA'
import { MessageDetail } from '@/components/listings/MessageDetail'
import { ListingViewTracker } from '@/components/listings/ListingViewTracker'

interface Props {
  params: Promise<{ school: string; listingId: string }>
}

export default async function ListingDetailPage({ params }: Props) {
  const { school: slug, listingId } = await params

  const [school, listing] = await Promise.all([
    getSchoolBySlug(slug),
    getListing(listingId),
  ])

  if (!school || !listing || listing.school_id !== school.id) notFound()

  const viewTracker = (
    <ListingViewTracker
      listingId={listing.id}
      sellerId={listing.seller_id}
      schoolId={listing.school_id}
      category={listing.category}
      listingType={listing.type}
    />
  )

  // Publicaciones del Tablón (no-venta) mantienen su vista existente.
  if (listing.type !== 'sell') {
    return (
      <>
        {viewTracker}
        <MessageDetail listing={listing} school={school} />
      </>
    )
  }

  const [related, activeCount, sellerRating] = await Promise.all([
    getRelatedListings(listing, 8),
    listing.seller_id
      ? getSellerActiveListingsCount(listing.seller_id, listing.school_id)
      : Promise.resolve(1),
    listing.seller_id
      ? getSellerRating(listing.seller_id)
      : Promise.resolve({ avg: 0, count: 0 }),
  ])

  const expired = isExpired(listing.expires_at) && listing.status === 'active'

  return (
    <div className="relative bg-surface pb-[7.5rem]">
      {viewTracker}
      <ListingHeroGallery
        images={listing.images ?? []}
        title={listing.title}
        category={listing.category}
        backHref={`/${school.slug}`}
        rightSlot={
          <>
            <ShareListingButton listing={listing} schoolName={school.name} />
            <FavoriteButton listingId={listing.id} variant="overlay" />
          </>
        }
      />

      <FadeIn className="relative -mt-8 rounded-t-[2rem] bg-background shadow-[0_-16px_40px_-24px_oklch(0.22_0.05_255_/_0.25)]">
        <div className="mx-auto max-w-2xl space-y-7 px-5 pt-7">
          {listing.status !== 'active' && (
            <StatusBadge status={listing.status} className="-mb-3" />
          )}

          <header>
            <h1 className="text-[1.45rem] font-semibold leading-tight tracking-tight text-foreground sm:text-[1.55rem]">
              {listing.title}
            </h1>
            <p className="mt-2 text-[2.1rem] font-bold leading-none tracking-[-0.025em] text-primary sm:text-[2.35rem]">
              {formatPrice(listing.price, listing.price_mode)}
            </p>
            <ListingBadges listing={listing} className="mt-4" />
            {expired && (
              <p className="mt-4 rounded-2xl bg-muted/70 px-4 py-3 text-[0.8rem] leading-relaxed text-muted-foreground">
                Este aviso se publicó hace más de 60 días — puede estar
                desactualizado.
              </p>
            )}
          </header>

          {listing.description && (
            <section>
              <h2 className="text-[0.95rem] font-semibold tracking-tight">
                Descripción
              </h2>
              <p className="mt-2 whitespace-pre-wrap text-[0.92rem] leading-relaxed text-muted-foreground">
                {listing.description}
              </p>
            </section>
          )}

          <ListingDetailsCard listing={listing} />

          <SellerTrustCard
            listing={listing}
            school={school}
            activeCount={activeCount}
          />

          {listing.seller_id && (
            <section className="rounded-3xl border border-border/70 bg-background p-4">
              <h2 className="text-[0.95rem] font-semibold tracking-tight">
                Calificación
              </h2>
              <p className="mt-1 text-[0.8rem] text-muted-foreground">
                ¿Ya compraste o coordinaste con esta familia? Calificá tu
                experiencia.
              </p>
              <div className="mt-3">
                <SellerRating
                  sellerId={listing.seller_id}
                  sellerName={listing.seller_name}
                  rating={sellerRating}
                />
              </div>
            </section>
          )}

          <QuickWhatsAppQuestions listing={listing} schoolName={school.name} />

          <ListingSecondaryActions listing={listing} schoolName={school.name} />

          {related.sameCategory.length > 0 && (
            <RelatedListingsCarousel
              title="También puede servirte"
              listings={related.sameCategory}
              schoolSlug={school.slug}
            />
          )}
        </div>
      </FadeIn>

      <StickyWhatsAppCTA listing={listing} schoolName={school.name} />
    </div>
  )
}
