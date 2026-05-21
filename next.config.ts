import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  // Next 16 bloquea por defecto requests al dev server desde origins distintos de
  // localhost. Para probar la app desde teléfonos en la misma WiFi hay que listar
  // los IPs de la LAN.
  allowedDevOrigins: ['192.168.1.29', '192.168.0.29', '10.0.0.29'],
}

export default nextConfig
