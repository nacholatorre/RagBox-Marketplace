import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import { SupabaseProvider } from '@/context/SupabaseProvider'
import { ServiceWorkerRegister } from '@/components/layout/ServiceWorkerRegister'
import { createClient } from '@/lib/supabase/server'
import './globals.css'

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'RagBox — Marketplace de Wellspring School',
  description:
    'Comprá, vendé o pedí uniformes, libros y útiles entre familias de Wellspring School.',
  manifest: '/manifest.webmanifest',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'RagBox' },
}

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full">
        <SupabaseProvider initialSession={session}>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                borderRadius: '14px',
                border: '1px solid oklch(0.927 0 0)',
                fontSize: '0.875rem',
              },
            }}
          />
          <ServiceWorkerRegister />
        </SupabaseProvider>
      </body>
    </html>
  )
}
