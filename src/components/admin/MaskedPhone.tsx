'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

function mask(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length <= 7) return digits
  return `${digits.slice(0, 4)}${'*'.repeat(digits.length - 7)}${digits.slice(-3)}`
}

export function MaskedPhone({ phone }: { phone: string }) {
  const [shown, setShown] = useState(false)
  return (
    <button
      type="button"
      onClick={() => setShown(s => !s)}
      className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-[0.78rem] font-medium tabular-nums text-foreground transition-colors hover:bg-accent"
      aria-label={shown ? 'Ocultar número' : 'Ver número'}
    >
      <span>{shown ? phone : mask(phone)}</span>
      {shown ? (
        <EyeOff className="size-3.5" strokeWidth={2} />
      ) : (
        <Eye className="size-3.5" strokeWidth={2} />
      )}
    </button>
  )
}
