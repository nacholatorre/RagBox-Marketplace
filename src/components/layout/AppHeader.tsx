import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft } from 'lucide-react'

interface Props {
  title?: string
  subtitle?: string
  backHref?: string
  right?: React.ReactNode
  /** Logo chico a la izquierda del título (ej. logo del colegio). */
  logoUrl?: string
  /** Header transparente sobre contenido full-bleed (ej. galería del detalle). */
  floating?: boolean
}

/** Header sticky, compacto y aireado. */
export function AppHeader({
  title,
  subtitle,
  backHref,
  right,
  logoUrl,
  floating,
}: Props) {
  if (floating) {
    return (
      <header className="pointer-events-none absolute inset-x-0 top-0 z-30 flex h-16 items-center justify-between px-4 pt-safe">
        {backHref && (
          <Link
            href={backHref}
            aria-label="Volver"
            className="pointer-events-auto flex size-10 items-center justify-center rounded-full bg-background/85 text-foreground shadow-soft backdrop-blur-md transition-transform active:scale-90"
          >
            <ChevronLeft className="size-5" />
          </Link>
        )}
        {right && <div className="pointer-events-auto">{right}</div>}
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-30 bg-background/85 backdrop-blur-xl">
      <div className="flex h-14 items-center gap-1.5 px-3">
        {backHref && (
          <Link
            href={backHref}
            aria-label="Volver"
            className="-ml-1 flex size-9 shrink-0 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted active:scale-90"
          >
            <ChevronLeft className="size-[1.35rem]" />
          </Link>
        )}
        {logoUrl && (
          <Image
            src={logoUrl}
            alt=""
            width={80}
            height={80}
            quality={95}
            sizes="40px"
            className="size-10 shrink-0 rounded-lg object-cover"
          />
        )}
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[1.05rem] font-semibold tracking-[-0.01em]">
            {title}
          </h1>
          {subtitle && (
            <p className="truncate text-[0.7rem] font-medium text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>
        {right && <div className="shrink-0">{right}</div>}
      </div>
    </header>
  )
}
