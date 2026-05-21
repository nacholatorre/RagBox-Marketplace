import type { LucideIcon } from 'lucide-react'
import {
  Shirt,
  BookOpen,
  PencilLine,
  Calculator,
  Dumbbell,
  Laptop,
  Package,
  Tag,
  Search,
  Gift,
} from 'lucide-react'
import type { Category, Condition, ListingType, SortKey } from '@/types'

export const CATEGORIES: { slug: Category; label: string; Icon: LucideIcon }[] = [
  { slug: 'uniformes', label: 'Uniformes', Icon: Shirt },
  { slug: 'libros', label: 'Libros', Icon: BookOpen },
  { slug: 'utiles', label: 'Útiles', Icon: PencilLine },
  { slug: 'calculadoras', label: 'Calculadoras', Icon: Calculator },
  { slug: 'deportes', label: 'Deportes', Icon: Dumbbell },
  { slug: 'tecnologia', label: 'Tecnología', Icon: Laptop },
  { slug: 'otros', label: 'Otros', Icon: Package },
]

/** Tipos de publicación: Vendo (oferta), Busco (pedido), Dono (donación). */
export const LISTING_TYPES: {
  slug: ListingType
  /** Etiqueta corta para badges/tabs (Vendo / Busco / Dono). */
  label: string
  /** Verbo para el selector de publicar (Vender / Buscar / Donar). */
  verb: string
  Icon: LucideIcon
}[] = [
  { slug: 'sell', label: 'Vendo', verb: 'Vender', Icon: Tag },
  { slug: 'request', label: 'Busco', verb: 'Buscar', Icon: Search },
  { slug: 'donation', label: 'Dono', verb: 'Donar', Icon: Gift },
]

export const CONDITIONS: { slug: Condition; label: string }[] = [
  { slug: 'nuevo', label: 'Nuevo' },
  { slug: 'como-nuevo', label: 'Como nuevo' },
  { slug: 'usado', label: 'Usado' },
]

export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'recientes', label: 'Más recientes' },
  { key: 'precio-asc', label: 'Precio: menor a mayor' },
  { key: 'precio-desc', label: 'Precio: mayor a menor' },
]

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2', '4', '6', '8', '10', '12', '14', '16']

export const SIZED_CATEGORIES: Category[] = ['uniformes', 'deportes']

export const LISTING_EXPIRY_DAYS = 60
export const MAX_IMAGES = 5
export const MAX_IMAGE_SIZE_MB = 5

/** WhatsApp del dueño del piloto (normalizado con prefijo país). */
export const ADMIN_WHATSAPP = '541159065841'
/** Email derivado — la auth usa `{whatsapp}@ragbox.app`. Único con acceso al panel /admin. */
export const ADMIN_EMAIL = `${ADMIN_WHATSAPP}@ragbox.app`

export function categoryLabel(slug: Category): string {
  return CATEGORIES.find(c => c.slug === slug)?.label ?? slug
}

/** Devuelve el componente de ícono (lucide) de la categoría. */
export function categoryIcon(slug: Category): LucideIcon {
  return CATEGORIES.find(c => c.slug === slug)?.Icon ?? Package
}

export function conditionMeta(slug: Condition) {
  return CONDITIONS.find(c => c.slug === slug) ?? CONDITIONS[2]
}

export function listingTypeLabel(slug: ListingType): string {
  return LISTING_TYPES.find(t => t.slug === slug)?.label ?? slug
}

export function listingTypeMeta(slug: ListingType) {
  return LISTING_TYPES.find(t => t.slug === slug) ?? LISTING_TYPES[0]
}
