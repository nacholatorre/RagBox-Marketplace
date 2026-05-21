import Link from 'next/link'
import { Plus } from 'lucide-react'

/** Mini banner que invita a publicar — se inserta antes de la grilla del marketplace. */
export function SellPrompt({ publishHref }: { publishHref: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-[oklch(0.97_0.04_55)] px-4 py-3.5">
      <div className="min-w-0 flex-1">
        <p className="text-[0.92rem] font-semibold tracking-tight">
          ¿Tenés algo para vender?
        </p>
        <p className="mt-0.5 text-[0.78rem] text-muted-foreground">
          Publicalo en menos de 1 minuto.
        </p>
      </div>
      <Link
        href={publishHref}
        className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-primary px-4 text-[0.85rem] font-semibold text-primary-foreground transition-transform active:scale-[0.97]"
      >
        <Plus className="size-4" strokeWidth={2.4} />
        Publicar
      </Link>
    </div>
  )
}
