import { notFound } from 'next/navigation'
import { BadgeCheck, ShieldCheck, Sparkles } from 'lucide-react'
import {
  getSchoolBySlug,
  getProfileById,
  getListingsBySeller,
  getSellerRating,
} from '@/lib/queries'
import { normalizeWhatsApp } from '@/lib/whatsapp'
import { AppHeader } from '@/components/layout/AppHeader'
import { StarRating } from '@/components/listings/StarRating'
import { SellerRating } from '@/components/listings/SellerRating'
import { SellerStats } from '@/components/listings/SellerStats'
import { SellerListingsTabs } from '@/components/listings/SellerListingsTabs'

interface Props {
  params: Promise<{ school: string; sellerId: string }>
}

export default async function SellerProfilePage({ params }: Props) {
  const { school: slug, sellerId } = await params

  const [school, profile] = await Promise.all([
    getSchoolBySlug(slug),
    getProfileById(sellerId),
  ])

  if (!school || !profile || profile.school_id !== school.id) notFound()

  const [listings, rating] = await Promise.all([
    getListingsBySeller(sellerId),
    getSellerRating(sellerId),
  ])

  const sells = listings.filter(l => l.type === 'sell')
  const activeCount = sells.filter(
    l => l.status === 'active' || l.status === 'reserved',
  ).length
  const soldCount = listings.filter(
    l =>
      (l.type === 'sell' && (l.status === 'sold' || l.status === 'paused')) ||
      (l.type === 'donation' && l.status === 'fulfilled'),
  ).length

  const memberSince = profile.created_at
    ? new Date(profile.created_at).toLocaleDateString('es-AR', {
        month: 'long',
        year: 'numeric',
      })
    : null

  const initial = (profile.full_name?.charAt(0) ?? '?').toUpperCase()
  const firstName = profile.full_name?.split(' ')[0] ?? 'esta familia'

  const experienceBadge = getExperienceBadge(rating.avg, rating.count)

  const waPhone = profile.whatsapp ? normalizeWhatsApp(profile.whatsapp) : null
  const waMessage = `Hola ${firstName}, vi tu perfil en RagBox ${school.name} y queria consultarte por tus publicaciones.`
  const waHref = waPhone
    ? `https://wa.me/${waPhone}?text=${encodeURIComponent(waMessage)}`
    : null

  return (
    <div className="bg-surface pb-24">
      <AppHeader title="Perfil de la familia" backHref={`/${school.slug}`} />

      <div className="space-y-7 px-5 pt-2">
        {/* Header */}
        <section className="flex items-center gap-4 rounded-3xl border border-border bg-background p-5 shadow-[0_2px_12px_-6px_oklch(0.22_0.05_255_/_0.12)]">
          <div className="relative shrink-0">
            <div className="flex size-16 items-center justify-center rounded-full bg-foreground text-[1.4rem] font-semibold text-background">
              {initial}
            </div>
            <span
              aria-hidden
              className="absolute -bottom-0.5 -right-0.5 flex size-6 items-center justify-center rounded-full bg-emerald-500 text-background ring-2 ring-background"
            >
              <ShieldCheck className="size-3.5" strokeWidth={2.4} />
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[1.15rem] font-semibold tracking-tight">
              {profile.full_name ?? 'Familia de Wellspring'}
            </p>
            <p className="mt-0.5 truncate text-[0.82rem] text-muted-foreground">
              Familia de {school.name}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[0.68rem] font-semibold text-accent-foreground">
                <BadgeCheck className="size-3" strokeWidth={2.2} />
                Familia verificada
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[0.68rem] font-semibold text-accent-foreground">
                <ShieldCheck className="size-3" strokeWidth={2.2} />
                Comunidad privada
              </span>
            </div>
            <div className="mt-2.5 flex items-center gap-2">
              <StarRating value={rating.avg} size={15} />
              <span className="text-[0.78rem] text-muted-foreground">
                {rating.count > 0
                  ? `${rating.avg.toFixed(1)} · ${rating.count} ${
                      rating.count === 1 ? 'calificación' : 'calificaciones'
                    }`
                  : 'Sin calificaciones todavía'}
              </span>
            </div>
            {experienceBadge && (
              <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-primary/12 px-2.5 py-0.5 text-[0.7rem] font-semibold text-primary">
                <Sparkles className="size-3" strokeWidth={2.2} />
                {experienceBadge}
              </p>
            )}
          </div>
        </section>

        {/* Stats */}
        <SellerStats
          activeCount={activeCount}
          soldCount={soldCount}
          ratingAvg={rating.avg}
          ratingCount={rating.count}
          memberSince={memberSince}
        />

        {/* Trust card */}
        <section className="rounded-3xl bg-muted/60 p-4">
          <div className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-background text-emerald-600">
              <ShieldCheck className="size-[1.15rem]" strokeWidth={2} />
            </span>
            <p className="text-[0.85rem] leading-relaxed text-muted-foreground">
              Esta familia publica dentro de la comunidad de {school.name}. El
              contacto se realiza directamente por WhatsApp.
            </p>
          </div>
        </section>

        {/* Rating + modal */}
        <section className="rounded-3xl border border-border p-4">
          <h2 className="text-[0.95rem] font-semibold tracking-tight">
            Calificación
          </h2>
          <p className="mt-1 text-[0.8rem] text-muted-foreground">
            ¿Ya compraste o coordinaste con esta familia? Calificá tu experiencia.
          </p>
          <div className="mt-3">
            <SellerRating
              sellerId={profile.id}
              sellerName={profile.full_name ?? 'esta familia'}
              rating={rating}
            />
          </div>
        </section>

        {/* Tabs con publicaciones */}
        <SellerListingsTabs
          listings={listings}
          schoolSlug={school.slug}
          sellerName={profile.full_name ?? 'esta familia'}
        />

        {/* CTA WhatsApp */}
        {waHref && (
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-whatsapp text-[0.95rem] font-semibold text-background transition-transform active:scale-[0.98]"
          >
            Contactar por WhatsApp
          </a>
        )}
      </div>
    </div>
  )
}

function getExperienceBadge(avg: number, count: number): string | null {
  if (count < 3) return null
  if (avg >= 4.5) return 'Muy buena experiencia'
  if (avg >= 4.0) return 'Buena experiencia'
  return null
}
