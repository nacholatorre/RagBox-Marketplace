'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { Category } from '@/types'
import { categoryIcon } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface Props {
  images: string[]
  title: string
  category: Category
}

export function ProductGallery({ images, title, category }: Props) {
  const [index, setIndex] = useState(0)
  const FallbackIcon = categoryIcon(category)

  if (images.length === 0) {
    return (
      <div className="flex aspect-[4/5] items-center justify-center bg-muted">
        <FallbackIcon className="size-16 text-muted-foreground/30" strokeWidth={1.4} />
      </div>
    )
  }

  function onScroll(e: React.UIEvent<HTMLDivElement>) {
    const el = e.currentTarget
    setIndex(Math.round(el.scrollLeft / el.clientWidth))
  }

  return (
    <div className="relative">
      <div
        onScroll={onScroll}
        className="scrollbar-hide flex snap-x snap-mandatory overflow-x-auto"
      >
        {images.map((src, i) => (
          <div
            key={i}
            className="relative aspect-[4/5] w-full shrink-0 snap-center bg-muted"
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
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
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
          <div className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center rounded-full bg-foreground/55 px-2 py-0.5 text-[0.7rem] font-medium text-background backdrop-blur">
            {index + 1}/{images.length}
          </div>
        </>
      )}
    </div>
  )
}
