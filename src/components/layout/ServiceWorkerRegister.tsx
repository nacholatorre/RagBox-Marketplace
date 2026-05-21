'use client'

import { useEffect } from 'react'

/**
 * Limpieza de service worker.
 *
 * Durante el piloto NO usamos service worker: un cache viejo puede dejar la app
 * en un estado roto ("no carga ninguna sección"). Este componente desregistra
 * cualquier SW previo y borra sus caches, así la app siempre va contra la red.
 *
 * (Cuando la app esté estable se puede volver a registrar un SW para PWA.)
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .getRegistrations()
        .then(regs => regs.forEach(reg => reg.unregister()))
        .catch(() => {})
    }

    if ('caches' in window) {
      caches
        .keys()
        .then(keys => keys.forEach(key => caches.delete(key)))
        .catch(() => {})
    }
  }, [])

  return null
}
