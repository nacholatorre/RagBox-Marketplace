'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, Loader2, Trash2 } from 'lucide-react'
import { Sheet } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

interface Props {
  open: boolean
  onClose: () => void
  onMarkSold: () => Promise<void> | void
  onDelete: () => Promise<void> | void
  busy: boolean
}

export function DeleteOrSoldModal({ open, onClose, onMarkSold, onDelete, busy }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    if (!open) setConfirmDelete(false)
  }, [open])

  return (
    <Sheet open={open} onClose={onClose} title="¿Cómo querés dar de baja el aviso?">
      <p className="pt-1 text-[0.83rem] text-muted-foreground">
        La mayoría de las veces es porque se vendió. ¡Bien hecho!
      </p>

      <button
        type="button"
        onClick={onMarkSold}
        disabled={busy}
        className={cn(
          'mt-4 flex w-full items-center gap-4 rounded-3xl bg-primary p-5 text-left text-primary-foreground shadow-float transition-all duration-150 active:scale-[0.99] disabled:opacity-60',
        )}
      >
        <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary-foreground/15">
          {busy ? (
            <Loader2 className="size-7 animate-spin" />
          ) : (
            <CheckCircle2 className="size-8" strokeWidth={2.2} />
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[1.15rem] font-bold leading-tight">
            Se vendió 🎉
          </span>
          <span className="mt-1 block text-[0.85rem] leading-snug text-primary-foreground/85">
            Lo marcamos como vendido y queda en tu historial.
          </span>
        </span>
      </button>

      <div className="my-4 flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-[0.7rem] font-medium uppercase tracking-wider text-muted-foreground">
          o
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>

      {!confirmDelete ? (
        <button
          type="button"
          onClick={() => setConfirmDelete(true)}
          disabled={busy}
          className="flex w-full items-center gap-3 rounded-2xl border border-border/70 bg-background p-3.5 text-left transition-colors hover:bg-muted disabled:opacity-50"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
            <Trash2 className="size-4" strokeWidth={1.8} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[0.9rem] font-semibold text-foreground">
              Otros motivos
            </span>
            <span className="mt-0.5 block text-[0.78rem] leading-snug text-muted-foreground">
              Eliminar el aviso definitivamente.
            </span>
          </span>
        </button>
      ) : (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4">
          <p className="text-[0.88rem] font-semibold text-foreground">
            ¿Eliminar definitivamente?
          </p>
          <p className="mt-1 text-[0.8rem] leading-snug text-muted-foreground">
            Esta acción no se puede deshacer. Si el aviso se vendió, mejor marcalo
            como vendido para que quede en tu historial.
          </p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              disabled={busy}
              className="h-11 flex-1 rounded-full border border-border bg-background text-[0.85rem] font-semibold transition-colors hover:bg-muted disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onDelete}
              disabled={busy}
              className="flex h-11 flex-1 items-center justify-center rounded-full bg-destructive text-[0.85rem] font-semibold text-white transition-transform active:scale-[0.98] disabled:opacity-50"
            >
              {busy ? <Loader2 className="size-4 animate-spin" /> : 'Sí, eliminar'}
            </button>
          </div>
        </div>
      )}
    </Sheet>
  )
}
