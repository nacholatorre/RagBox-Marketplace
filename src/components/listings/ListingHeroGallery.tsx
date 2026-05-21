'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import type { Category } from '@/types'
import { categoryIcon } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface Props {
  images: string[]
  title: string
  category: Category
  backHref: string
  /** Slots flotantes arriba a la derecha (favorito + compartir). */
  rightSlot?: React.ReactNode
}

/**
 * Galería hero del detalle. Imagen 4/5, back flotante a la izquierda,
 * slots flotantes a la derecha (favorito + compartir), contador 1/N y dots.
 */
export function ListingHeroGallery({
  images,
  title,
  category,
  backHref,
  rightSlot,
}: Props) {
  const [index, setIndex] = useState(0)
  const FallbackIcon = categoryIcon(category)

  function onScroll(e: React.UIEvent<HTMLDivElement>) {
    const el = e.currentTarget
    setIndex(Math.round(el.scrollLeft / el.clientWidth))
  }

  return (
    <div className="relative bg-muted">
      {/* Header flotante */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between px-4 pt-safe">
        <div className="pointer-events-auto pt-3">
          <Link
            href={backHref}
            aria-label="Volver"
            className="flex size-10 items-center justify-center rounded-full bg-background/85 text-foreground shadow-soft backdrop-blur-md transition-transform active:scale-90"
          >
            <ChevronLeft className="size-5" />
          </Link>
        </div>
        {rightSlot && (
          <div className="pointer-events-auto flex items-center gap-2 pt-3">
            {rightSlot}
          </div>
        )}
      </div>

      {images.length === 0 ? (
        <div className="flex aspect-[4/5] items-center justify-center">
          <FallbackIcon
            className="size-16 text-muted-foreground/30"
            strokeWidth={1.4}
          />
        </div>
      ) : (
        <>
          <div
            onScroll={onScroll}
            className="scrollbar-hide flex snap-x snap-mandatory overflow-x-auto"
          >
            {images.map((src, i) => (
              <div
                key={i}
                className="relative aspect-[4/5] w-full shrink-0 snap-center"
              >
                <Image
                  src={src}
                  alt={`${title} — ${i + 1}`}
                  fill
                  sizes="(max-width: 672px) 100vw, 672px"
                  className="object-cover"
                  priority={i === 0}
                />
              </div>
            ))}
          </div>

          {images.length > 1 && (
            <>
              {/* Contador 1/N flotante */}
              <div className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-foreground/55 px-2.5 py-0.5 text-[0.7rem] font-semibold text-background backdrop-blur">
                {index + 1} / {images.length}
              </div>
              {/* Dots */}
              <div className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
                {images.map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      'h-1.5 rounded-full bg-background transition-all duration-300',
                      i === index ? 'w-5' : 'w-1.5 opacity-50',
                    )}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* Sombra inferior sutil para que la card asome */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-b from-transparent to-background/30" />
    </div>
  )
}
