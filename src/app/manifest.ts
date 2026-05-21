import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'RagBox — Marketplace escolar',
    short_name: 'RagBox',
    description:
      'Comprá y vendé uniformes, libros y útiles dentro de tu comunidad escolar.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    orientation: 'portrait',
    categories: ['shopping', 'education'],
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
    ],
  }
}
