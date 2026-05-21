'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

/** Segmentos de ruta que NO son colegios. */
const RESERVED = new Set([
  'favoritos',
  'perfil',
  'mis-publicaciones',
  'login',
  'auth',
  'admin',
])

const STORAGE_KEY = 'narketplace:school'

/**
 * Devuelve el slug del colegio activo. Lo toma de la URL cuando estás en una
 * ruta de colegio, y lo recuerda (localStorage) para las pantallas que no lo
 * tienen en la URL (favoritos, perfil).
 */
export function useSchoolSlug(): string | null {
  const pathname = usePathname()
  const [slug, setSlug] = useState<string | null>(null)

  useEffect(() => {
    const seg = pathname.split('/')[1]
    if (seg && !RESERVED.has(seg)) {
      setSlug(seg)
      try {
        localStorage.setItem(STORAGE_KEY, seg)
      } catch {}
    } else {
      try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved && RESERVED.has(saved)) {
          localStorage.removeItem(STORAGE_KEY)
          setSlug(null)
        } else {
          setSlug(saved)
        }
      } catch {}
    }
  }, [pathname])

  return slug
}
