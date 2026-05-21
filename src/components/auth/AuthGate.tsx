'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Loader2, Lock } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

interface Props {
  children: React.ReactNode
  title?: string
  description?: string
}

export function AuthGate({
  children,
  title = 'Creá tu perfil',
  description = 'Solo tu nombre y tu WhatsApp. Sin email ni contraseña.',
}: Props) {
  const { isAuthed, loading } = useAuth()
  const pathname = usePathname()

  if (loading) {
    return (
      <div className="flex min-h-[55vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!isAuthed) {
    return (
      <div className="flex flex-col items-center justify-center px-8 py-20 text-center">
        <div className="flex size-16 items-center justify-center rounded-[1.25rem] bg-muted text-muted-foreground">
          <Lock className="size-6" strokeWidth={1.7} />
        </div>
        <h2 className="mt-4 text-[1.05rem] font-semibold tracking-tight">{title}</h2>
        <p className="mt-1.5 max-w-[17rem] text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
        <Link
          href={`/login?next=${encodeURIComponent(pathname)}`}
          className="mt-6 inline-flex h-12 items-center rounded-full bg-primary px-7 text-[0.95rem] font-semibold text-primary-foreground transition-transform active:scale-[0.97]"
        >
          Empezar
        </Link>
      </div>
    )
  }

  return <>{children}</>
}
