import type { Listing, ListingStatus, PriceMode } from '@/types'

/** Precio formateado considerando el modo (fijo / a convenir / gratis). */
export function formatPrice(
  price: number | null,
  priceMode: PriceMode = 'fixed',
): string {
  if (priceMode === 'free') return 'Gratis'
  if (priceMode === 'negotiable' || price === null) return 'A convenir'
  return '$' + Math.round(price).toLocaleString('es-AR')
}

/**
 * Precio según el tipo de publicación.
 * Donación → "Gratis / Donación"; pedido (Busco) → "" (el caller oculta la línea).
 */
export function formatListingPrice(listing: Listing): string {
  if (listing.type === 'donation') return 'Gratis / Donación'
  if (listing.type === 'request') return ''
  return formatPrice(listing.price, listing.price_mode)
}

export function formatRelativeDate(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.max(0, Math.floor(diff / 60_000))
  const hours = Math.floor(diff / 3_600_000)
  const days = Math.floor(diff / 86_400_000)

  if (minutes < 1) return 'recién'
  if (minutes < 60) return `hace ${minutes} min`
  if (hours < 24) return `hace ${hours}h`
  if (days === 1) return 'ayer'
  if (days < 7) return `hace ${days} días`
  if (days < 30) return `hace ${Math.floor(days / 7)} semanas`
  return `hace ${Math.floor(days / 30)} meses`
}

export function isExpired(expiresAt: string): boolean {
  return new Date(expiresAt) < new Date()
}

/** Etiqueta de estado para mostrar al usuario. */
export function getListingStatusLabel(
  status: ListingStatus,
  expiresAt?: string,
): string {
  if (status === 'active' && expiresAt && isExpired(expiresAt)) return 'Vencido'
  switch (status) {
    case 'active':
      return 'Disponible'
    case 'reserved':
      return 'Reservado'
    case 'sold':
      return 'Vendido'
    case 'paused':
      return 'Pausado'
    case 'fulfilled':
      return 'Resuelto'
  }
}
