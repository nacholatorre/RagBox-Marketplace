'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import { Sheet } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

type Reason = 'vendido' | 'info-incorrecta' | 'spam' | 'contacto-falso' | 'otro'

const REASONS: { key: Reason; label: string; description: string }[] = [
  {
    key: 'vendido',
    label: 'Ya fue vendido',
    description: 'El aviso sigue activo pero el artículo ya no está disponible.',
  },
  {
    key: 'info-incorrecta',
    label: 'Información incorrecta',
    description: 'Talle, precio o estado no coinciden con la realidad.',
  },
  { key: 'spam', label: 'Spam', description: 'Aviso repetido o promocional.' },
  {
    key: 'contacto-falso',
    label: 'Contacto falso',
    description: 'El número de WhatsApp no responde o es de otra persona.',
  },
  { key: 'otro', label: 'Otro motivo', description: 'Contanos abajo qué pasa.' },
]

interface Props {
  open: boolean
  onClose: () => void
  listingId: string
}

export function ReportListingModal({ open, onClose, listingId }: Props) {
  const { user, isAuthed, supabase } = useAuth()
  const router = useRouter()
  const [reason, setReason] = useState<Reason | null>(null)
  const [detail, setDetail] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function submit() {
    if (!reason || submitting) return
    if (!isAuthed || !user) {
      toast('Iniciá sesión para reportar el aviso')
      onClose()
      router.push('/login')
      return
    }
    setSubmitting(true)
    const { error } = await supabase.from('reports').insert({
      listing_id: listingId,
      reporter_id: user.id,
      reason,
      detail: detail.trim() || null,
    })
    setSubmitting(false)
    if (error) {
      toast.error('No se pudo enviar el reporte')
      return
    }
    toast.success('Gracias, lo revisaremos')
    setReason(null)
    setDetail('')
    onClose()
  }

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Reportar publicación"
      footer={
        <button
          type="button"
          onClick={submit}
          disabled={!reason || submitting}
          className="flex h-12 w-full items-center justify-center rounded-full bg-foreground text-[0.92rem] font-semibold text-background transition-transform active:scale-[0.98] disabled:opacity-40"
        >
          {submitting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            'Enviar reporte'
          )}
        </button>
      }
    >
      <p className="pt-1 text-[0.83rem] text-muted-foreground">
        Tu reporte se envía de forma anónima al equipo de RagBox.
      </p>

      <ul className="mt-3 space-y-2">
        {REASONS.map(r => {
          const active = reason === r.key
          return (
            <li key={r.key}>
              <button
                type="button"
                onClick={() => setReason(r.key)}
                aria-pressed={active}
                className={cn(
                  'flex w-full items-start gap-3 rounded-2xl border p-3.5 text-left transition-all duration-150 active:scale-[0.99]',
                  active
                    ? 'border-primary bg-primary/[0.05]'
                    : 'border-border/70 bg-background hover:border-border',
                )}
              >
                <span
                  className={cn(
                    'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                    active
                      ? 'border-primary bg-primary'
                      : 'border-border bg-background',
                  )}
                >
                  {active && (
                    <span className="size-1.5 rounded-full bg-primary-foreground" />
                  )}
                </span>
                <span className="min-w-0">
                  <span className="block text-[0.9rem] font-semibold text-foreground">
                    {r.label}
                  </span>
                  <span className="mt-0.5 block text-[0.78rem] leading-snug text-muted-foreground">
                    {r.description}
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>

      <label className="mt-4 block">
        <span className="text-[0.82rem] font-semibold text-foreground">
          Contanos más (opcional)
        </span>
        <textarea
          value={detail}
          onChange={e => setDetail(e.target.value)}
          maxLength={400}
          rows={3}
          placeholder="Detalles que nos ayuden a revisar el aviso…"
          className="mt-1.5 w-full resize-none rounded-2xl border border-border/70 bg-background px-3.5 py-3 text-[0.88rem] outline-none transition-colors focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
        />
      </label>
    </Sheet>
  )
}
