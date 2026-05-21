import { createClient } from '@/lib/supabase/server'
import type {
  Category,
  Condition,
  Listing,
  Profile,
  School,
  SellerRating,
  SortKey,
} from '@/types'

export interface ListingFilters {
  category?: Category
  query?: string
  size?: string
  condition?: Condition
  minPrice?: number
  maxPrice?: number
  sort?: SortKey
}

/** Todos los colegios activos. */
export async function getSchools(): Promise<School[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('schools')
    .select('*')
    .eq('active', true)
    .order('name')
  return (data as School[]) ?? []
}

/** Un colegio por slug, o null si no existe. */
export async function getSchoolBySlug(slug: string): Promise<School | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('schools')
    .select('*')
    .eq('slug', slug)
    .eq('active', true)
    .maybeSingle()
  return (data as School) ?? null
}

/** Un perfil por id, o null si no existe. */
export async function getProfileById(id: string): Promise<Profile | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  return (data as Profile) ?? null
}

/** Avisos de venta activos de un colegio con filtros y orden. */
export async function getListings(
  schoolId: string,
  filters: ListingFilters = {},
): Promise<Listing[]> {
  const supabase = await createClient()
  let q = supabase
    .from('listings')
    .select('*')
    .eq('school_id', schoolId)
    .eq('type', 'sell')
    .eq('status', 'active')

  if (filters.category) q = q.eq('category', filters.category)
  if (filters.size) q = q.eq('size', filters.size)
  if (filters.condition) q = q.eq('condition', filters.condition)
  if (filters.minPrice !== undefined) q = q.gte('price', filters.minPrice)
  if (filters.maxPrice !== undefined) q = q.lte('price', filters.maxPrice)
  if (filters.query) {
    const safe = filters.query.replace(/[%,]/g, ' ').trim()
    if (safe) q = q.or(`title.ilike.%${safe}%,description.ilike.%${safe}%`)
  }

  switch (filters.sort) {
    case 'precio-asc':
      q = q.order('price', { ascending: true, nullsFirst: false })
      break
    case 'precio-desc':
      q = q.order('price', { ascending: false, nullsFirst: false })
      break
    default:
      q = q.order('created_at', { ascending: false })
  }

  const { data } = await q.limit(30)
  return (data as Listing[]) ?? []
}

/**
 * Mensajes del Tablón de un colegio. Sin `type` devuelve todos los mensajes
 * (cualquier `type` distinto de 'sell'); con `type` filtra por Busco / Dono / Aviso.
 */
export async function getBoardPosts(
  schoolId: string,
  type?: 'request' | 'donation' | 'announcement',
): Promise<Listing[]> {
  const supabase = await createClient()
  let q = supabase
    .from('listings')
    .select('*')
    .eq('school_id', schoolId)
    .eq('status', 'active')
  q = type ? q.eq('type', type) : q.neq('type', 'sell')
  const { data } = await q.order('created_at', { ascending: false }).limit(30)
  return (data as Listing[]) ?? []
}

/** Un aviso por id. */
export async function getListing(id: string): Promise<Listing | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('listings')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  return (data as Listing) ?? null
}

/** Avisos de un vendedor (para "mis publicaciones"). */
export async function getListingsBySeller(sellerId: string): Promise<Listing[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('listings')
    .select('*')
    .eq('seller_id', sellerId)
    .order('created_at', { ascending: false })
  return (data as Listing[]) ?? []
}

/** Colegios activos + cantidad de avisos activos de cada uno (para la landing). */
export async function getSchoolsWithCounts(): Promise<
  (School & { listingCount: number })[]
> {
  const supabase = await createClient()
  const [{ data: schools }, { data: listings }] = await Promise.all([
    supabase.from('schools').select('*').eq('active', true).order('name'),
    supabase.from('listings').select('school_id').eq('status', 'active'),
  ])
  const counts = new Map<string, number>()
  for (const l of listings ?? []) {
    counts.set(l.school_id, (counts.get(l.school_id) ?? 0) + 1)
  }
  return ((schools as School[]) ?? []).map(s => ({
    ...s,
    listingCount: counts.get(s.id) ?? 0,
  }))
}

/** Avisos recientes con foto, para la vista previa de la landing. */
export async function getShowcaseListings(limit = 4): Promise<Listing[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('listings')
    .select('*')
    .eq('type', 'sell')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(24)
  const withImages = ((data as Listing[]) ?? []).filter(
    l => Array.isArray(l.images) && l.images.length > 0,
  )
  return withImages.slice(0, limit)
}

/** Avisos relacionados: misma categoría / mismo vendedor (para el detalle). */
export async function getRelatedListings(
  listing: Listing,
  limit = 6,
): Promise<{ sameCategory: Listing[]; sameSeller: Listing[] }> {
  const supabase = await createClient()
  const base = () =>
    supabase
      .from('listings')
      .select('*')
      .eq('school_id', listing.school_id)
      .eq('type', listing.type)
      .eq('status', 'active')
      .neq('id', listing.id)

  const [cat, seller] = await Promise.all([
    base().eq('category', listing.category).limit(limit),
    listing.seller_id
      ? base().eq('seller_id', listing.seller_id).limit(limit)
      : Promise.resolve({ data: [] }),
  ])

  return {
    sameCategory: (cat.data as Listing[]) ?? [],
    sameSeller: (seller.data as Listing[]) ?? [],
  }
}

/** Cuántas publicaciones activas tiene el vendedor en este colegio (incluye la actual). */
export async function getSellerActiveListingsCount(
  sellerId: string,
  schoolId: string,
): Promise<number> {
  const supabase = await createClient()
  const { count } = await supabase
    .from('listings')
    .select('id', { count: 'exact', head: true })
    .eq('seller_id', sellerId)
    .eq('school_id', schoolId)
    .eq('status', 'active')
  return count ?? 0
}

export interface AdminMetrics {
  users: Profile[]
  listingCount: number
  contactCount: number
  topListings: { id: string; title: string; contacts: number }[]
}

/** Datos para el panel de administración (usuarios + métricas de contacto). */
export async function getAdminMetrics(): Promise<AdminMetrics> {
  const supabase = await createClient()
  const [usersRes, listingCountRes, contactsRes] = await Promise.all([
    supabase.from('profiles').select('*').order('created_at', { ascending: false }),
    supabase.from('listings').select('id', { count: 'exact', head: true }),
    supabase.from('contact_events').select('listing_id'),
  ])

  const contacts = (contactsRes.data ?? []) as { listing_id: string }[]
  const byListing = new Map<string, number>()
  for (const c of contacts) {
    byListing.set(c.listing_id, (byListing.get(c.listing_id) ?? 0) + 1)
  }

  const topIds = [...byListing.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(e => e[0])

  let topListings: AdminMetrics['topListings'] = []
  if (topIds.length) {
    const { data } = await supabase
      .from('listings')
      .select('id, title')
      .in('id', topIds)
    const titleById = new Map(
      (data ?? []).map(l => [l.id as string, l.title as string]),
    )
    topListings = topIds.map(id => ({
      id,
      title: titleById.get(id) ?? 'Aviso eliminado',
      contacts: byListing.get(id) ?? 0,
    }))
  }

  return {
    users: (usersRes.data as Profile[]) ?? [],
    listingCount: listingCountRes.count ?? 0,
    contactCount: contacts.length,
    topListings,
  }
}

/** Promedio de calificación de un vendedor. */
export async function getSellerRating(sellerId: string): Promise<SellerRating> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('reviews')
    .select('rating')
    .eq('seller_id', sellerId)
  const ratings = (data ?? []).map(r => r.rating as number)
  if (ratings.length === 0) return { avg: 0, count: 0 }
  const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length
  return { avg, count: ratings.length }
}
