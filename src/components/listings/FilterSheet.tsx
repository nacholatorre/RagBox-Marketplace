'use client'

import { useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { CONDITIONS, SIZES, SIZED_CATEGORIES } from '@/lib/constants'
import type { Category, Condition } from '@/types'
import { useQueryParams } from '@/hooks/useQueryParams'
import { Sheet } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

export function FilterSheet() {
  const { searchParams, setParams } = useQueryParams()
  const [open, setOpen] = useState(false)

  const cat = searchParams.get('cat') as Category | null
  const showSize = !!cat && SIZED_CATEGORIES.includes(cat)

  const urlCondition = (searchParams.get('condition') as Condition | null) ?? null
  const urlSize = searchParams.get('size')
  const urlMin = searchParams.get('min') ?? ''
  const urlMax = searchParams.get('max') ?? ''
  const activeCount =
    (urlCondition ? 1 : 0) + (urlSize ? 1 : 0) + (urlMin || urlMax ? 1 : 0)

  const [condition, setCondition] = useState<Condition | null>(urlCondition)
  const [size, setSize] = useState<string | null>(urlSize)
  const [min, setMin] = useState(urlMin)
  const [max, setMax] = useState(urlMax)

  function openSheet() {
    setCondition(urlCondition)
    setSize(urlSize)
    setMin(urlMin)
    setMax(urlMax)
    setOpen(true)
  }

  function apply() {
    setParams({
      condition,
      size: showSize ? size : null,
      min: min || null,
      max: max || null,
    })
    setOpen(false)
  }

  function clearAll() {
    setCondition(null)
    setSize(null)
    setMin('')
    setMax('')
    setParams({ condition: null, size: null, min: null, max: null })
    setOpen(false)
  }

  return (
    <>
      <button
        type="button"
        onClick={openSheet}
        className={cn(
          'flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-[0.85rem] font-medium transition-colors',
          activeCount > 0
            ? 'border-foreground bg-foreground text-background'
            : 'border-border bg-background hover:bg-muted',
        )}
      >
        <SlidersHorizontal
          className={cn(
            'size-[0.95rem]',
            activeCount > 0 ? 'text-background' : 'text-muted-foreground',
          )}
        />
        Filtros
        {activeCount > 0 && (
          <span className="flex size-[1.1rem] items-center justify-center rounded-full bg-background text-[0.7rem] font-bold text-foreground">
            {activeCount}
          </span>
        )}
      </button>

      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        title="Filtros"
        footer={
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={clearAll}
              className="h-12 flex-1 rounded-full border border-border text-[0.95rem] font-semibold transition-colors hover:bg-muted"
            >
              Limpiar
            </button>
            <button
              type="button"
              onClick={apply}
              className="h-12 flex-[2] rounded-full bg-primary text-[0.95rem] font-semibold text-primary-foreground transition-transform active:scale-[0.98]"
            >
              Aplicar
            </button>
          </div>
        }
      >
        <div className="space-y-7 py-3">
          <FilterGroup label="Condición">
            <div className="flex flex-wrap gap-2">
              {CONDITIONS.map(c => (
                <Chip
                  key={c.slug}
                  active={condition === c.slug}
                  onClick={() => setCondition(condition === c.slug ? null : c.slug)}
                >
                  {c.label}
                </Chip>
              ))}
            </div>
          </FilterGroup>

          {showSize && (
            <FilterGroup label="Talle">
              <div className="flex flex-wrap gap-2">
                {SIZES.map(s => (
                  <Chip
                    key={s}
                    active={size === s}
                    onClick={() => setSize(size === s ? null : s)}
                  >
                    {s}
                  </Chip>
                ))}
              </div>
            </FilterGroup>
          )}

          <FilterGroup label="Precio">
            <div className="flex items-center gap-2.5">
              <PriceInput value={min} onChange={setMin} placeholder="Mínimo" />
              <span className="text-muted-foreground">—</span>
              <PriceInput value={max} onChange={setMax} placeholder="Máximo" />
            </div>
          </FilterGroup>
        </div>
      </Sheet>
    </>
  )
}

function FilterGroup({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-3">
      <p className="text-[0.95rem] font-semibold tracking-tight">{label}</p>
      {children}
    </div>
  )
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full px-4 py-2.5 text-[0.9rem] font-medium transition-colors',
        active
          ? 'bg-foreground text-background'
          : 'bg-muted text-muted-foreground hover:text-foreground',
      )}
    >
      {children}
    </button>
  )
}

function PriceInput({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
}) {
  return (
    <input
      type="number"
      inputMode="numeric"
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      className="h-12 w-full rounded-2xl bg-muted px-4 text-[0.95rem] outline-none transition-shadow focus:ring-2 focus:ring-foreground/10"
    />
  )
}
