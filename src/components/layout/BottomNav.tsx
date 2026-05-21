'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'motion/react'
import {
  Heart,
  Home,
  MessageSquare,
  Plus,
  Tag,
  User,
  Users,
} from 'lucide-react'
import { useSchoolSlug } from '@/hooks/useSchoolSlug'
import { cn } from '@/lib/utils'
import { Sheet } from '@/components/ui/sheet'

export function BottomNav() {
  const pathname = usePathname()
  const school = useSchoolSlug()
  const [sheetOpen, setSheetOpen] = useState(false)

  // Pantalla completa: detalle de producto. (publicar y tablón mantienen el nav.)
  if (/^\/[^/]+\/(?!publicar$|tablon$)[^/]+$/.test(pathname)) return null

  const homeHref = school ? `/${school}` : '/'
  const sellHref = school ? `/${school}/publicar` : '/'
  const messageHref = school ? `/${school}/publicar?tipo=mensaje` : '/'

  const tabs = [
    { href: homeHref, label: 'Inicio', icon: Home, active: pathname === homeHref },
    {
      href: '/favoritos',
      label: 'Favoritos',
      icon: Heart,
      active: pathname.startsWith('/favoritos'),
    },
    {
      href: school ? `/${school}/tablon` : '/',
      label: 'Tablón',
      icon: Users,
      active: pathname.endsWith('/tablon'),
    },
    {
      href: '/perfil',
      label: 'Perfil',
      icon: User,
      active: pathname.startsWith('/perfil'),
    },
  ]

  return (
    <>
      <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center pb-safe">
        <div className="pointer-events-auto mb-3 flex items-center gap-1 rounded-full border border-white/10 bg-foreground/95 p-1.5 shadow-float backdrop-blur-xl">
          {tabs.slice(0, 2).map(tab => (
            <NavTab key={tab.href} {...tab} />
          ))}

          <button
            type="button"
            aria-label="Publicar"
            onClick={() => setSheetOpen(true)}
            className="mx-0.5 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-transform active:scale-90"
          >
            <Plus className="size-[1.5rem]" strokeWidth={2.6} />
          </button>

          {tabs.slice(2).map(tab => (
            <NavTab key={tab.href} {...tab} />
          ))}
        </div>
      </nav>

      <Sheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="¿Qué querés publicar?"
        footer={
          <button
            type="button"
            onClick={() => setSheetOpen(false)}
            className="flex h-12 w-full items-center justify-center rounded-full border border-border text-[0.9rem] font-semibold text-foreground transition-colors hover:bg-muted"
          >
            Cancelar
          </button>
        }
      >
        <div className="grid gap-2.5 py-2">
          <Link
            href={sellHref}
            onClick={() => setSheetOpen(false)}
            className="flex items-center gap-4 rounded-2xl border border-border p-4 transition-colors active:bg-muted"
          >
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <Tag className="size-[1.25rem]" strokeWidth={2} />
            </span>
            <span className="min-w-0">
              <span className="block text-[0.98rem] font-semibold tracking-tight">
                Vender producto
              </span>
              <span className="mt-0.5 block text-[0.8rem] text-muted-foreground">
                Uniformes, libros, útiles y más.
              </span>
            </span>
          </Link>

          <Link
            href={messageHref}
            onClick={() => setSheetOpen(false)}
            className="flex items-center gap-4 rounded-2xl border border-border p-4 transition-colors active:bg-muted"
          >
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-foreground text-background">
              <MessageSquare className="size-[1.25rem]" strokeWidth={2} />
            </span>
            <span className="min-w-0">
              <span className="block text-[0.98rem] font-semibold tracking-tight">
                Publicar en el tablón
              </span>
              <span className="mt-0.5 block text-[0.8rem] text-muted-foreground">
                Busco, dono o aviso algo.
              </span>
            </span>
          </Link>
        </div>
      </Sheet>
    </>
  )
}

function NavTab({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string
  label: string
  icon: typeof Home
  active: boolean
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      className="relative flex size-11 items-center justify-center rounded-full"
    >
      {active && (
        <motion.span
          layoutId="nav-pill"
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          className="absolute inset-0 rounded-full bg-background/15"
        />
      )}
      <Icon
        className={cn(
          'relative size-[1.35rem] transition-colors',
          active ? 'text-background' : 'text-background/50',
        )}
        strokeWidth={active ? 2.4 : 2}
      />
    </Link>
  )
}
