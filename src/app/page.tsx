import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight,
  BookOpen,
  Clock,
  Handshake,
  Heart,
  Lock,
  MoreHorizontal,
  PencilLine,
  Shirt,
  UploadCloud,
} from 'lucide-react'
const SCHOOL_SLUG = 'wellspring-ba'

const HERO_CATEGORIES = [
  { Icon: Shirt, label: 'Uniformes' },
  { Icon: BookOpen, label: 'Libros' },
  { Icon: PencilLine, label: 'Útiles' },
  { Icon: MoreHorizontal, label: 'y más' },
] as const

const STEPS = [
  {
    kind: 'icon' as const,
    Icon: UploadCloud,
    title: '1. Publicás',
    text: 'Subís tu producto en segundos.',
  },
  {
    kind: 'whatsapp' as const,
    title: '2. Te contactan',
    text: 'Te escriben por WhatsApp.',
  },
  {
    kind: 'icon' as const,
    Icon: Handshake,
    title: '3. Coordinan',
    text: 'Ustedes arreglan entrega y pago.',
  },
]

const FEATURED = [
  { img: '/images/chomba.png', title: 'Chomba', size: 'Talle 10', price: '$8.000' },
  { img: '/images/sweater.png', title: 'Sweater', size: 'Talle 12', price: '$14.000' },
  { img: '/images/kilts.png', title: 'Pollera del kilt', size: 'Talle 12', price: '$16.000' },
]

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.518 5.26l-.999 3.648 3.97-1.717zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  )
}

export default function LandingPage() {
  const publishHref = `/${SCHOOL_SLUG}/publicar`
  const shopHref = `/${SCHOOL_SLUG}`

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/icon.svg" alt="" width={32} height={32} className="size-8" />
            <span className="text-[1.1rem] font-bold tracking-tight">RagBox</span>
          </Link>
          <div className="flex items-center gap-2 md:gap-3">
            <Link
              href={shopHref}
              className="rounded-full px-3 py-2 text-[0.9rem] font-medium text-foreground hover:bg-muted"
            >
              Comprar
            </Link>
            <Link
              href={publishHref}
              className="rounded-full bg-primary px-4 py-2.5 text-[0.85rem] font-semibold text-primary-foreground shadow-soft transition-transform active:scale-[0.97] md:px-5 md:text-[0.9rem]"
            >
              Publicar gratis
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-5 pt-10 pb-12 md:px-8 md:pt-16 md:pb-20">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
          <div>
            <h1 className="text-[2.4rem] font-semibold leading-[1.05] tracking-[-0.03em] md:text-[3.5rem]">
              Comprá y <span className="text-primary">vendé</span>
              <br />
              cosas del cole.
            </h1>
            <p className="mt-4 text-[1.05rem] leading-relaxed text-muted-foreground md:text-[1.15rem]">
              Entre familias de Wellspring School.
            </p>

            <ul className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
              {HERO_CATEGORIES.map(({ Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-1.5 text-[0.95rem] font-medium"
                >
                  <Icon className="size-[1.05rem]" strokeWidth={1.8} />
                  {label}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href={publishHref}
                className="inline-flex h-14 items-center rounded-full bg-primary px-7 text-[1rem] font-semibold text-primary-foreground shadow-soft transition-transform active:scale-[0.98]"
              >
                Publicar gratis
              </Link>
              <Link
                href={shopHref}
                className="inline-flex items-center gap-1.5 px-2 py-2 text-[0.95rem] font-semibold text-foreground hover:text-primary"
              >
                Ver productos
                <ArrowRight className="size-4" />
              </Link>
            </div>

            <p className="mt-4 flex items-center gap-1.5 text-[0.85rem] text-muted-foreground">
              <Clock className="size-3.5" strokeWidth={1.8} />
              Publicar toma menos de 1 minuto.
            </p>
          </div>

          <div className="mx-auto w-full max-w-[480px]">
            <Image
              src="/images/hero-box.svg"
              alt="Caja de RagBox con productos del colegio: sweater, polera, libros, calculadora, lápices y mochila."
              width={600}
              height={600}
              priority
              className="h-auto w-full"
            />
          </div>
        </div>
      </section>

      {/* Así de simple */}
      <section className="bg-muted/60">
        <div className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
          <h2 className="text-center text-[1.75rem] font-semibold tracking-tight md:text-[2.25rem]">
            Así de simple
          </h2>
          <div className="mt-10 grid gap-8 md:mt-14 md:grid-cols-3 md:gap-6">
            {STEPS.map(s => (
              <div key={s.title} className="text-center">
                <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-whatsapp/12">
                  {s.kind === 'whatsapp' ? (
                    <WhatsAppGlyph className="size-[1.5rem] text-whatsapp" />
                  ) : (
                    <s.Icon
                      className="size-[1.5rem] text-whatsapp"
                      strokeWidth={1.8}
                    />
                  )}
                </div>
                <h3 className="mt-4 text-[1.05rem] font-semibold">{s.title}</h3>
                <p className="mx-auto mt-1.5 max-w-[18rem] text-[0.95rem] leading-relaxed text-muted-foreground">
                  {s.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Productos publicados */}
      <section className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
        <div className="flex items-baseline justify-between">
          <h2 className="text-[1.55rem] font-semibold tracking-tight md:text-[1.9rem]">
            Productos publicados
          </h2>
          <Link
            href={shopHref}
            className="inline-flex items-center gap-1 text-[0.9rem] font-semibold text-foreground hover:text-primary"
          >
            Ver todos
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="mt-7 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0">
          {FEATURED.map(p => (
            <article
              key={p.title}
              className="w-[78%] shrink-0 snap-start overflow-hidden rounded-[1.4rem] border border-border bg-background shadow-soft md:w-auto"
            >
              <div className="relative aspect-[4/5] bg-muted">
                <Image
                  src={p.img}
                  alt={p.title}
                  fill
                  sizes="(max-width:768px) 78vw, 320px"
                  className="object-cover"
                />
              </div>
              <div className="px-4 py-4">
                <p className="text-[1.05rem] font-semibold tracking-tight">{p.title}</p>
                <p className="mt-0.5 text-[0.85rem] text-muted-foreground">{p.size}</p>
                <p className="mt-1.5 text-[1.1rem] font-bold text-whatsapp">{p.price}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="px-5 pb-14 md:px-8 md:pb-20">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 rounded-[1.75rem] bg-[oklch(0.97_0.04_55)] px-6 py-7 md:flex-row md:items-center md:justify-between md:px-10 md:py-9">
          <div className="flex items-start gap-4 md:items-center">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-primary text-primary">
              <Heart className="size-[1.35rem]" strokeWidth={2.2} />
            </span>
            <p className="text-[1.15rem] font-semibold leading-snug tracking-tight md:text-[1.4rem]">
              Lo que tu familia ya no usa,
              <br />
              otra familia <span className="text-primary">lo necesita</span>.
            </p>
          </div>
          <div className="flex w-full flex-col items-stretch gap-1.5 md:w-auto md:items-end">
            <Link
              href={publishHref}
              className="inline-flex h-14 items-center justify-center rounded-full bg-primary px-7 text-[1rem] font-semibold text-primary-foreground shadow-soft transition-transform active:scale-[0.98]"
            >
              Publicar gratis
            </Link>
            <span className="flex items-center justify-center gap-1.5 text-[0.8rem] text-muted-foreground md:justify-end">
              <Clock className="size-3" strokeWidth={1.8} />
              Toma menos de 1 minuto.
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 py-7">
        <p className="flex items-center justify-center gap-2 text-[0.85rem] text-muted-foreground">
          <Lock className="size-3.5" strokeWidth={1.8} />
          Solo familias de Wellspring School
        </p>
      </footer>
    </main>
  )
}
