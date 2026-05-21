'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import type { SellerRating as SellerRatingType } from '@/types'
import { useAuth } from '@/hooks/useAuth'
import { Sheet } from '@/components/ui/sheet'
import { StarRating } from './StarRating'

interface Props {
  sellerId: string
  sellerName: string
  rating: SellerRatingType
}

export function SellerRating({ sellerId, sellerName, rating }: Props) {
  const { user, isAuthed, supabase } = useAuth()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [stars, setStars] = useState(0)
  const [comment, setComment] = useState('')
  const [saving, setSaving] = useState(false)

  const isSelf = user?.id === sellerId

  function openSheet() {
    if (!isAuthed) {
      toast('Iniciá sesión para calificar')
      router.push('/login')
      return
    }
    setOpen(true)
  }

  async function submit() {
    if (!user || stars < 1) {
      toast.error('Elegí cuántas estrellas')
      return
    }
    setSaving(true)
    const { error } = await supabase.from('reviews').upsert(
      {
        seller_id: sellerId,
        rater_id: user.id,
        rating: stars,
        comment: comment.trim() || null,
      },
      { onConflict: 'seller_id,rater_id' },
    )
    setSaving(false)
    if (error) {
      toast.error('No se pudo guardar la calificación')
      return
    }
    setOpen(false)
    toast.success('¡Gracias por tu calificación!')
    router.refresh()
  }

  return (
    <div>
      <div className="flex items-center gap-2">
        <StarRating value={rating.avg} size={15} />
        <span className="text-[0.78rem] text-muted-foreground">
          {rating.count > 0
            ? `${rating.avg.toFixed(1)} · ${rating.count} ${
                rating.count === 1 ? 'reseña' : 'reseñas'
              }`
            : 'Sin reseñas todavía'}
        </span>
      </div>

      {!isSelf && (
        <button
          type="button"
          onClick={openSheet}
          className="mt-2 text-[0.82rem] font-semibold text-primary underline-offset-4 hover:underline"
        >
          Calificar al vendedor
        </button>
      )}

      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        title={`Calificar a ${sellerName}`}
        footer={
          <button
            type="button"
            onClick={submit}
            disabled={saving}
            className="flex h-12 w-full items-center justify-center rounded-full bg-primary text-[0.95rem] font-semibold text-primary-foreground transition-transform active:scale-[0.98] disabled:opacity-60"
          >
            {saving ? <Loader2 className="size-5 animate-spin" /> : 'Enviar calificación'}
          </button>
        }
      >
        <div className="space-y-5 py-3">
          <div className="flex flex-col items-center gap-3">
            <p className="text-[0.9rem] text-muted-foreground">
              ¿Cómo fue tu experiencia?
            </p>
            <StarRating value={stars} onChange={setStars} size={36} />
          </div>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            maxLength={300}
            rows={3}
            placeholder="Dejá un comentario (opcional)…"
            className="w-full resize-none rounded-2xl bg-muted p-4 text-[0.95rem] outline-none focus:ring-2 focus:ring-foreground/10"
          />
        </div>
      </Sheet>
    </div>
  )
}
