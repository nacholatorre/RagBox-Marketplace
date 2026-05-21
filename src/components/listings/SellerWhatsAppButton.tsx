'use client'

import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import { trackEvent } from '@/lib/track'

interface Props {
  href: string
  sellerId: string
  schoolId: string
  label?: string
}

/**
 * Boton "Contactar por WhatsApp" del perfil publico de vendedor.
 * Bloquea el click si la familia no inicio sesion y trackea click_whatsapp.
 */
export function SellerWhatsAppButton({
  href,
  sellerId,
  schoolId,
  label = 'Contactar por WhatsApp',
}: Props) {
  const { user, isAuthed, supabase } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  function handleClick(e: React.MouseEvent) {
    if (!isAuthed) {
      e.preventDefault()
      toast('Iniciá sesión para contactar por WhatsApp')
      router.push(`/login?next=${encodeURIComponent(pathname)}`)
      return
    }
    trackEvent(supabase, {
      event_name: 'click_whatsapp',
      seller_id: sellerId,
      school_id: schoolId,
      user_id: user?.id ?? null,
      metadata: {
        whatsapp_action: 'general_contact',
        page_source: 'seller_profile',
      },
    })
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-whatsapp text-[0.95rem] font-semibold text-background transition-transform active:scale-[0.98]"
    >
      {label}
    </a>
  )
}
