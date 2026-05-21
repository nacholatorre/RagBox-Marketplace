// Service worker de RagBox — hace la app instalable como PWA.
//
// Estrategia segura para un piloto donde la frescura importa más que el offline:
//  - Navegaciones y datos dinámicos (RSC, API de Supabase) → SIEMPRE de la red.
//    Nunca se sirve una página vieja del cache (evita "no abre / no carga").
//  - Solo se cachean assets versionados (/_next/static, imágenes): son inmutables,
//    así que cache-first es 100% seguro y acelera la carga.
//  - El cache está versionado: al cambiar VERSION se borran los caches viejos.
const VERSION = 'ragbox-v2'
const ASSET_CACHE = `ragbox-assets-${VERSION}`

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(
        keys.filter(key => key !== ASSET_CACHE).map(key => caches.delete(key)),
      )
      await self.clients.claim()
    })(),
  )
})

self.addEventListener('fetch', event => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)

  // Cross-origin (Supabase, fuentes, etc.): pasa directo, nunca se cachea.
  if (url.origin !== self.location.origin) return

  // Navegaciones y payloads RSC: siempre de la red, sin versión vieja.
  if (request.mode === 'navigate' || url.searchParams.has('_rsc')) return

  // Solo cacheamos assets con hash de contenido / estáticos estables.
  const isStaticAsset =
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/images/') ||
    /\.(?:js|css|woff2?|png|jpe?g|gif|svg|webp|ico)$/.test(url.pathname)

  if (!isStaticAsset) return

  event.respondWith(
    caches.open(ASSET_CACHE).then(async cache => {
      const cached = await cache.match(request)
      if (cached) return cached
      try {
        const response = await fetch(request)
        if (response.ok) cache.put(request, response.clone())
        return response
      } catch (err) {
        if (cached) return cached
        throw err
      }
    }),
  )
})
