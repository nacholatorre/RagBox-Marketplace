'use client'

import { useEffect, useRef, useState } from 'react'
import { Search, X } from 'lucide-react'
import { useQueryParams } from '@/hooks/useQueryParams'

export function SearchBar() {
  const { searchParams, setParams } = useQueryParams()
  const [value, setValue] = useState(searchParams.get('q') ?? '')
  const first = useRef(true)

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    const t = setTimeout(() => setParams({ q: value.trim() || null }), 380)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-4 top-1/2 size-[1.05rem] -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        inputMode="search"
        placeholder="Buscar uniforme, libro, talle..."
        value={value}
        onChange={e => setValue(e.target.value)}
        className="h-12 w-full rounded-full bg-muted pl-11 pr-11 text-[0.95rem] outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-foreground/10"
      />
      {value && (
        <button
          type="button"
          onClick={() => setValue('')}
          aria-label="Limpiar"
          className="absolute right-2.5 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full bg-background text-muted-foreground transition-transform active:scale-90"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  )
}
