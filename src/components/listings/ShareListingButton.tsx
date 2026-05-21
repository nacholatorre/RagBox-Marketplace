'use client'

import { Share } from 'lucide-react'
import { toast } from 'sonner'
import type { Listing } from '@/types'
import { buildShareText } from '@/lib/whatsapp'

interface Props {
  listing: Listing
  schoolName: string
}

export function ShareListingButton({ listing, schoolName }: Props) {
  async function share() {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    const text = buildShareText(listing, schoolName, url)

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: listing.title, text, url })
      } catch {
        // cancelado por el usuario
      }
      return
    }

    try {
      await navigator.clipboard.writeText(`${text}`)
      toast.success('Link copiado al portapapeles')
    } catch {
      toast.error('No se pudo compartir')
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      aria-label="Compartir aviso"
      className="flex size-10 items-center justify-center rounded-full bg-background/85 text-foreground shadow-soft backdrop-blur-md transition-transform active:scale-90"
    >
      <Share className="size-[1.05rem]" />
    </button>
  )
}
