'use client'

import { useState } from 'react'
import { Flag, Share2 } from 'lucide-react'
import { toast } from 'sonner'
import type { Listing } from '@/types'
import { buildShareText } from '@/lib/whatsapp'
import { ReportListingModal } from './ReportListingModal'

interface Props {
  listing: Listing
  schoolName: string
}

/** Fila con dos acciones suaves: Compartir aviso + Reportar publicación. */
export function ListingSecondaryActions({ listing, schoolName }: Props) {
  const [reportOpen, setReportOpen] = useState(false)

  async function share() {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    const text = buildShareText(listing, schoolName, url)

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: listing.title, text, url })
      } catch {
        /* cancelado */
      }
      return
    }

    try {
      await navigator.clipboard.writeText(text)
      toast.success('Link copiado al portapapeles')
    } catch {
      toast.error('No se pudo compartir')
    }
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={share}
          className="flex items-center justify-center gap-2 rounded-2xl border border-border/70 bg-background px-3 py-3 text-[0.85rem] font-semibold text-foreground/85 transition-all duration-200 hover:bg-muted active:scale-[0.98]"
        >
          <Share2 className="size-[1.05rem]" strokeWidth={1.9} />
          Compartir aviso
        </button>
        <button
          type="button"
          onClick={() => setReportOpen(true)}
          className="flex items-center justify-center gap-2 rounded-2xl border border-border/70 bg-background px-3 py-3 text-[0.85rem] font-semibold text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground active:scale-[0.98]"
        >
          <Flag className="size-[1.05rem]" strokeWidth={1.9} />
          Reportar
        </button>
      </div>

      <ReportListingModal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        listingId={listing.id}
      />
    </>
  )
}
