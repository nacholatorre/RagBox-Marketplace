'use client'

import { useEffect } from 'react'
import { cn } from '@/lib/utils'

interface Props {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
}

/** Bottom sheet premium con grab handle y slide-up. */
export function Sheet({ open, onClose, title, children, footer }: Props) {
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <>
      <div
        onClick={onClose}
        aria-hidden
        className={cn(
          'fixed inset-0 z-50 bg-foreground/25 backdrop-blur-[2px] transition-opacity duration-300',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          'fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[88vh] max-w-2xl flex-col rounded-t-[1.75rem] bg-background shadow-float transition-transform duration-300 ease-out',
          open ? 'translate-y-0' : 'translate-y-full',
        )}
      >
        <div className="flex justify-center pt-2.5">
          <div className="h-1 w-9 rounded-full bg-border" />
        </div>
        <div className="px-5 pb-1 pt-2.5">
          <h2 className="text-[1.05rem] font-semibold tracking-tight">{title}</h2>
        </div>
        <div className="flex-1 overflow-y-auto px-5 pb-2">{children}</div>
        {footer && (
          <div className="border-t border-border px-5 pb-safe pt-3">
            <div className="pb-3">{footer}</div>
          </div>
        )}
      </div>
    </>
  )
}
