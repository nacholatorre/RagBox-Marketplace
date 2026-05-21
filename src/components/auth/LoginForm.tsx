'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { ensureRagBoxUser } from '@/app/actions/auth'

const DEFAULT_REDIRECT = '/wellspring-ba'

/**
 * Login del piloto: solo nombre + WhatsApp. Sin email visible, sin contraseña,
 * sin esperar a recibir nada. El server lo resuelve todo (ver Server Action
 * `ensureRagBoxUser`).
 */
export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || DEFAULT_REDIRECT

  const [fullName, setFullName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return

    setLoading(true)

    // 1) El server crea (o ajusta) el usuario y devuelve credenciales internas.
    const ensure = await ensureRagBoxUser({ fullName, whatsapp })
    if (!ensure.ok) {
      setLoading(false)
      if (ensure.error === 'name') toast.error('Poné tu nombre')
      else if (ensure.error === 'whatsapp') toast.error('Tu WhatsApp parece incompleto')
      else if (ensure.error === 'missing-key')
        toast.error('Falta SUPABASE_SERVICE_ROLE_KEY en .env.local. Avisame.')
      else toast.error(ensure.message || 'No pudimos crear tu perfil. Probá de nuevo.')
      return
    }

    // 2) Con las credenciales que devolvió el server, abrimos sesión en el browser.
    //    El server ya grabó el perfil completo, así que el provider lo carga listo.
    const supabase = createClient()
    const signIn = await supabase.auth.signInWithPassword({
      email: ensure.email,
      password: ensure.password,
    })

    if (signIn.error || !signIn.data.user) {
      setLoading(false)
      toast.error('No pudimos iniciar sesión. Probá de nuevo.')
      return
    }

    toast.success('¡Listo! Bienvenido a RagBox')
    router.push(next)
    router.refresh()
  }

  return (
    <div>
      <Image
        src="/icon.svg"
        alt=""
        width={52}
        height={52}
        className="object-contain"
      />
      <h1 className="mt-5 text-[1.6rem] font-semibold leading-tight tracking-[-0.02em]">
        Entrá a RagBox
      </h1>
      <p className="mt-2 text-[0.95rem] leading-relaxed text-muted-foreground">
        Solo necesitamos tu nombre y tu WhatsApp para que otras familias de
        Wellspring te puedan contactar. Sin email, sin contraseña.
      </p>

      <form onSubmit={handleSubmit} className="mt-7 space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="fullName" className="text-[0.85rem] font-semibold">
            Tu nombre
          </label>
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            placeholder="María García"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            className="h-14 w-full rounded-2xl bg-muted px-4 text-[0.95rem] outline-none transition-shadow focus:ring-2 focus:ring-foreground/10"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="whatsapp" className="text-[0.85rem] font-semibold">
            Tu WhatsApp
          </label>
          <input
            id="whatsapp"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="11 1234-5678"
            value={whatsapp}
            onChange={e => setWhatsapp(e.target.value)}
            className="h-14 w-full rounded-2xl bg-muted px-4 text-[0.95rem] outline-none transition-shadow focus:ring-2 focus:ring-foreground/10"
          />
          <p className="text-[0.75rem] text-muted-foreground">
            Las familias te contactan a este número.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex h-14 w-full items-center justify-center rounded-full bg-primary text-[0.95rem] font-semibold text-primary-foreground transition-transform active:scale-[0.98] disabled:opacity-60"
        >
          {loading ? <Loader2 className="size-5 animate-spin" /> : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
