import Link from 'next/link'
import { Compass } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center bg-background px-8 text-center">
      <div className="flex size-16 items-center justify-center rounded-[1.25rem] bg-muted text-muted-foreground">
        <Compass className="size-7" strokeWidth={1.6} />
      </div>
      <h1 className="mt-5 text-[1.25rem] font-semibold tracking-tight">
        No encontramos esta página
      </h1>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
        El aviso o el colegio que buscás no existe o fue dado de baja.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex h-12 items-center rounded-full bg-primary px-7 text-[0.95rem] font-semibold text-primary-foreground transition-transform active:scale-[0.97]"
      >
        Volver al inicio
      </Link>
    </main>
  )
}
