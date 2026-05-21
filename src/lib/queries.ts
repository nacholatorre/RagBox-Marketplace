import { createClient } from '@/lib/supabase/server'
import type {
  Category,
  Condition,
  Listing,
  ListingType,
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
    .select('*, seller:profiles!seller_id(avatar_url)')
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
    .select('*, seller:profiles!seller_id(avatar_url)')
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
    .select('*, seller:profiles!seller_id(avatar_url)')
    .eq('id', id)
    .maybeSingle()
  return (data as Listing) ?? null
}

/** Avisos de un vendedor (para "mis publicaciones"). */
export async function getListingsBySeller(sellerId: string): Promise<Listing[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('listings')
    .select('*, seller:profiles!seller_id(avatar_url)')
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

export type AdminRange = 'today' | '7d' | '30d' | 'all'

export interface AdminMetrics {
  range: AdminRange
  users: Profile[]
  totals: {
    families: number
    listings: number
    contacts: number
    views: number
    activeListings: number
    soldOrFulfilled: number
    requests: number
    donations: number
    newListings: number
    closedInRange: number
  }
  /** contactos / vistas en porcentaje. null si no hubo vistas. */
  contactRate: number | null
  publishFunnel: { started: number; completed: number; conversionPct: number }
  contactsByType: { sell: number; request: number; donation: number }
  contactsByCategory: { category: Category; count: number }[]
  topListings: {
    id: string
    title: string
    type: ListingType
    category: Category
    price: number | null
    contacts: number
  }[]
}

function rangeCutoff(range: AdminRange): string | null {
  const now = new Date()
  if (range === 'today') {
    const d = new Date(now)
    d.setHours(0, 0, 0, 0)
    return d.toISOString()
  }
  if (range === '7d') return new Date(now.getTime() - 7 * 24 * 3600 * 1000).toISOString()
  if (range === '30d') return new Date(now.getTime() - 30 * 24 * 3600 * 1000).toISOString()
  return null
}

interface ListingMeta {
  id: string
  title: string
  type: ListingType
  category: Category
  price: number | null
}

/** Datos para el panel de administración. Filtra eventos por rango de fecha. */
export async function getAdminMetrics(range: AdminRange = '7d'): Promise<AdminMetrics> {
  const supabase = await createClient()
  const cutoff = rangeCutoff(range)

  // Todos los eventos del rango — se bucketean en memoria por event_name.
  let eventsQ = supabase
    .from('events')
    .select('event_name, listing_id')
    .in('event_name', [
      'click_whatsapp',
      'view_listing',
      'start_publish',
      'complete_publish',
      'mark_sold',
      'mark_fulfilled',
    ])
  if (cutoff) eventsQ = eventsQ.gte('created_at', cutoff)

  // Avisos creados dentro del rango
  let newListingsQ = supabase
    .from('listings')
    .select('id', { count: 'exact', head: true })
  if (cutoff) newListingsQ = newListingsQ.gte('created_at', cutoff)

  const [usersRes, listingsRes, eventsRes, newListingsRes] = await Promise.all([
    supabase.from('profiles').select('*').order('created_at', { ascending: false }),
    supabase.from('listings').select('id, title, type, category, price, status'),
    eventsQ,
    newListingsQ,
  ])

  const allListings = (listingsRes.data ?? []) as (ListingMeta & { status: string })[]
  const listingsById = new Map<string, ListingMeta>(
    allListings.map(l => [
      l.id,
      { id: l.id, title: l.title, type: l.type, category: l.category, price: l.price },
    ]),
  )

  const allEvents = (eventsRes.data ?? []) as {
    event_name: string
    listing_id: string | null
  }[]

  const eventsByName = (name: string) =>
    allEvents.filter(e => e.event_name === name)

  const contactEvents = eventsByName('click_whatsapp')
  const viewEvents = eventsByName('view_listing')
  const startEvents = eventsByName('start_publish')
  const completeEvents = eventsByName('complete_publish')
  const soldEvents = eventsByName('mark_sold')
  const fulfilledEvents = eventsByName('mark_fulfilled')

  // Conteos de contacto por listing
  const byListing = new Map<string, number>()
  for (const ev of contactEvents) {
    if (!ev.listing_id) continue
    byListing.set(ev.listing_id, (byListing.get(ev.listing_id) ?? 0) + 1)
  }

  // Contactos por tipo (sell/request/donation) y por categoría
  const byType = { sell: 0, request: 0, donation: 0 }
  const byCategoryMap = new Map<Category, number>()
  for (const ev of contactEvents) {
    if (!ev.listing_id) continue
    const l = listingsById.get(ev.listing_id)
    if (!l) continue
    if (l.type === 'sell') byType.sell++
    else if (l.type === 'request') byType.request++
    else if (l.type === 'donation') byType.donation++
    byCategoryMap.set(l.category, (byCategoryMap.get(l.category) ?? 0) + 1)
  }

  // Top 8 publicaciones contactadas
  const topListings = [...byListing.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([id, contacts]) => {
      const l = listingsById.get(id)
      return {
        id,
        title: l?.title ?? 'Aviso eliminado',
        type: l?.type ?? ('sell' as ListingType),
        category: l?.category ?? ('otros' as Category),
        price: l?.price ?? null,
        contacts,
      }
    })

  const sells = allListings.filter(l => l.type === 'sell')
  const contacts = contactEvents.length
  const views = viewEvents.length
  const started = startEvents.length
  const completed = completeEvents.length

  return {
    range,
    users: (usersRes.data as Profile[]) ?? [],
    totals: {
      families: (usersRes.data ?? []).length,
      listings: sells.length,
      contacts,
      views,
      activeListings: sells.filter(l => l.status === 'active').length,
      soldOrFulfilled: allListings.filter(
        l => l.status === 'sold' || l.status === 'fulfilled',
      ).length,
      requests: allListings.filter(l => l.type === 'request' && l.status === 'active').length,
      donations: allListings.filter(l => l.type === 'donation' && l.status === 'active').length,
      newListings: newListingsRes.count ?? 0,
      closedInRange: soldEvents.length + fulfilledEvents.length,
    },
    contactRate: views > 0 ? (contacts / views) * 100 : null,
    publishFunnel: {
      started,
      completed,
      conversionPct: started > 0 ? (completed / started) * 100 : 0,
    },
    contactsByType: byType,
    contactsByCategory: Array.from(byCategoryMap.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count),
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
