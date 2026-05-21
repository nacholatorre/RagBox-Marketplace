'use client'

import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'

interface Props {
  href: string
  label?: string
}

/**
 * Botón "Contactar por WhatsApp" del perfil público de vendedor.
 * Bloquea el click si la familia no inició sesión y redirige a /login.
 */
export function SellerWhatsAppButton({ href, label = 'Contactar por WhatsApp' }: Props) {
  const { isAuthed } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  function gateAuth(e: React.MouseEvent) {
    if (!isAuthed) {
      e.preventDefault()
      toast('Iniciá sesión para contactar por WhatsApp')
      router.push(`/login?next=${encodeURIComponent(pathname)}`)
    }
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={gateAuth}
      className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-whatsapp text-[0.95rem] font-semibold text-background transition-transform active:scale-[0.98]"
    >
      {label}
    </a>
  )
}
