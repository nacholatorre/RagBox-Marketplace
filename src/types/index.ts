export type Category =
  | 'uniformes'
  | 'libros'
  | 'utiles'
  | 'calculadoras'
  | 'deportes'
  | 'tecnologia'
  | 'otros'

export type Condition = 'nuevo' | 'como-nuevo' | 'usado'

export type ListingStatus =
  | 'active'
  | 'reserved'
  | 'sold'
  | 'paused'
  | 'fulfilled'

/**
 * Tipo de publicación.
 * - `sell`: aviso de venta en el marketplace.
 * - `request` / `donation` / `announcement`: mensajes del Tablón (Busco / Dono / Aviso).
 */
export type ListingType = 'sell' | 'request' | 'donation' | 'announcement'

/** Modo de precio de un aviso de venta. */
export type PriceMode = 'fixed' | 'negotiable' | 'free'

/** Temporada del uniforme. */
export type Season = 'verano' | 'invierno' | 'todo-el-anio'

export type SortKey = 'recientes' | 'precio-asc' | 'precio-desc'

export type ReportReason =
  | 'producto-incorrecto'
  | 'ya-vendido'
  | 'spam'
  | 'info-falsa'
  | 'otro'

export interface School {
  id: string
  name: string
  slug: string
  city: string | null
  logo_url: string | null
  active: boolean
  created_at: string
}

export interface Profile {
  id: string
  full_name: string | null
  whatsapp: string | null
  school_id: string | null
  avatar_url: string | null
  created_at: string
}

export interface Listing {
  id: string
  school_id: string
  seller_id: string | null
  type: ListingType
  title: string
  description: string | null
  price: number | null
  price_mode: PriceMode
  category: Category
  condition: Condition
  size: string | null
  season: string | null
  grade: string | null
  seller_name: string
  seller_whatsapp: string
  images: string[]
  status: ListingStatus
  created_at: string
  expires_at: string
  /** Relación opcional con `profiles` cuando se hace JOIN — solo trae avatar. */
  seller?: { avatar_url: string | null } | null
}

export type ListingInsert = Omit<Listing, 'id' | 'created_at' | 'expires_at'>

export interface Favorite {
  user_id: string
  listing_id: string
  created_at: string
}

export interface Conversation {
  id: string
  listing_id: string
  buyer_id: string
  seller_id: string
  created_at: string
  last_message_at: string
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  body: string
  created_at: string
  read_at: string | null
}

export interface Review {
  id: string
  seller_id: string
  rater_id: string
  rating: number
  comment: string | null
  created_at: string
}

/** Promedio de calificación de un vendedor. */
export interface SellerRating {
  avg: number
  count: number
}

export interface Comment {
  id: string
  listing_id: string
  author_id: string
  body: string
  created_at: string
}
