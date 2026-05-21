'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  value: number
  /** Si se pasa, las estrellas son clickeables. */
  onChange?: (value: number) => void
  size?: number
}

/** Estrellas — modo lectura (sin onChange) o selección (con onChange). */
export function StarRating({ value, onChange, size = 18 }: Props) {
  const [hover, setHover] = useState(0)
  const interactive = !!onChange
  const shown = hover || value

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(n => {
        const filled = n <= Math.round(shown)
        const star = (
          <Star
            style={{ width: size, height: size }}
            className={cn(
              filled
                ? 'fill-foreground text-foreground'
                : 'fill-transparent text-muted-foreground/30',
            )}
            strokeWidth={1.8}
          />
        )
        if (!interactive) return <span key={n}>{star}</span>
        return (
          <button
            key={n}
            type="button"
            aria-label={`${n} estrellas`}
            onClick={() => onChange(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            className="transition-transform active:scale-90"
          >
            {star}
          </button>
        )
      })}
    </div>
  )
}
