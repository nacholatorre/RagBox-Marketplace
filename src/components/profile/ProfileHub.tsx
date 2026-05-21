'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  BadgeCheck,
  BarChart3,
  ChevronRight,
  Heart,
  LifeBuoy,
  Loader2,
  LogOut,
  Package,
  Plus,
  School as SchoolIcon,
  ShieldCheck,
} from 'lucide-react'
import { toast } from 'sonner'
import type { Listing } from '@/types'
import { useAuth } from '@/hooks/useAuth'
import { normalizeWhatsApp } from '@/lib/whatsapp'
import { formatPrice } from '@/lib/formatters'
import { categoryIcon, ADMIN_EMAIL, ADMIN_WHATSAPP } from '@/lib/constants'
import { StatusBadge } from '@/components/listings/StatusBadge'
import { AvatarUploader } from '@/components/profile/AvatarUploader'

const SCHOOL_NAME = 'Wellspring School'
const SCHOOL_SLUG = 'wellspring-ba'

export function ProfileHub({ initialListings }: { initialListings: Listing[] }) {
  const { user, profile, supabase, signOut, refreshProfile } = useAuth()
  const [favCount, setFavCount] = useState(0)

  async function saveAvatar(url: string) {
    if (!user) return
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, avatar_url: url })
    if (error) {
      toast.error('No se pudo guardar la foto')
      return
    }
    await refreshProfile()
    toast.success('Foto actualizada')
  }

  useEffect(() => {
    if (!user) return
    supabase
      .from('favorites')
      .select('listing_id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .then(({ count }) => setFavCount(count ?? 0))
  }, [user, supabase])

  const all = initialListings
  const sells = all.filter(l => l.type === 'sell')
  const messages = all.filter(l => l.type !== 'sell')
  const active = sells.filter(l => l.status === 'active' || l.status === 'reserved')
  const sold = sells.filter(l => l.status === 'sold')

  const profileIncomplete = !profile?.full_name || !profile?.whatsapp
  const isAdmin = user?.email === ADMIN_EMAIL

  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('es-AR', {
        month: 'long',
        year: 'numeric',
      })
    : null

  return (
    <div className="space-y-6 px-5 py-4">
      {/* Header card */}
      <div className="flex items-center gap-4 rounded-[1.5rem] border border-border p-5">
        <div className="shrink-0">
          <AvatarUploader
            value={profile?.avatar_url ?? null}
            onChange={saveAvatar}
            fallbackText={profile?.full_name || '?'}
            size={64}
          />
        </div>
        <div className="min-w-0">
          <p className="truncate text-[1.1rem] font-semibold tracking-tight">
            {profile?.full_name || 'Tu perfil'}
          </p>
          <p className="truncate text-[0.8rem] text-muted-foreground">
            Familia de {SCHOOL_NAME}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[0.68rem] font-semibold text-accent-foreground">
              <BadgeCheck className="size-3" strokeWidth={2.2} />
              Familia verificada
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[0.68rem] font-semibold text-accent-foreground">
              <ShieldCheck className="size-3" strokeWidth={2.2} />
              Comunidad privada
            </span>
          </div>
        </div>
      </div>

      {/* Aviso de perfil incompleto */}
      {profileIncomplete && (
        <div className="rounded-[1.4rem] bg-accent px-4 py-3.5 text-[0.85rem] leading-relaxed text-accent-foreground">
          Completá tu perfil para que otras familias puedan contactarte por tus
          publicaciones.
        </div>
      )}

      {/* Actividad compacta */}
      <section>
        <h2 className="text-[0.95rem] font-semibold tracking-tight">Tu actividad</h2>
        <p className="mt-1 text-[0.85rem] tabular-nums text-muted-foreground">
          {active.length} {active.length === 1 ? 'activo' : 'activos'} ·{' '}
          {sold.length} {sold.length === 1 ? 'vendido' : 'vendidos'} ·{' '}
          {favCount} {favCount === 1 ? 'favorito' : 'favoritos'} ·{' '}
          {messages.length} {messages.length === 1 ? 'mensaje' : 'mensajes'}
        </p>
      </section>

      {/* Acción principal */}
      <Link
        href="/wellspring-ba/publicar"
        className="flex h-14 items-center justify-center gap-2 rounded-full bg-primary text-[0.95rem] font-semibold text-primary-foreground transition-transform active:scale-[0.98]"
      >
        <Plus className="size-[1.15rem]" strokeWidth={2.4} />
        Publicar algo del cole
      </Link>

      {/* Acciones secundarias */}
      <div className="grid grid-cols-2 gap-2.5">
        <QuickAction
          href="/mis-publicaciones"
          icon={<Package className="size-[1.15rem]" />}
          label="Mis publicaciones"
        />
        <QuickAction
          href="/favoritos"
          icon={<Heart className="size-[1.15rem]" />}
          label="Favoritos"
        />
      </div>

      {/* Acción terciaria */}
      <Link
        href="/wellspring-ba/publicar?tipo=mensaje"
        className="block text-center text-[0.85rem] font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        Escribir en el tablón →
      </Link>

      {/* My listings preview */}
      {sells.length > 0 && (
        <section>
          <div className="mb-2.5 flex items-baseline justify-between">
            <h2 className="text-[0.95rem] font-semibold tracking-tight">
              Mis publicaciones
            </h2>
            <Link
              href="/mis-publicaciones"
              className="text-[0.8rem] font-medium text-muted-foreground"
            >
              Ver todas
            </Link>
          </div>
          <div className="space-y-2">
            {sells.slice(0, 3).map(l => {
              const Icon = categoryIcon(l.category)
              return (
                <Link
                  key={l.id}
                  href={`/${SCHOOL_SLUG}/${l.id}`}
                  className="flex items-center gap-3 rounded-2xl border border-border p-2.5 transition-colors active:bg-muted"
                >
                  <div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted">
                    {l.images?.[0] ? (
                      <Image src={l.images[0]} alt="" fill className="object-cover" sizes="48px" />
                    ) : (
                      <Icon className="size-5 text-muted-foreground/40" strokeWidth={1.6} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[0.85rem] font-medium">{l.title}</p>
                    <p className="text-[0.8rem] font-semibold">
                      {formatPrice(l.price, l.price_mode)}
                    </p>
                  </div>
                  <StatusBadge status={l.status} expiresAt={l.expires_at} />
                  <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* Trust */}
      <section className="rounded-[1.4rem] bg-muted/60 p-4">
        <TrustRow
          icon={<SchoolIcon className="size-[1.05rem]" />}
          label="Comunidad"
          value={SCHOOL_NAME}
        />
        {memberSince && (
          <TrustRow
            icon={<ShieldCheck className="size-[1.05rem]" />}
            label="Familia desde"
            value={memberSince}
          />
        )}
      </section>

      {/* Ajustes (secundario) */}
      <ProfileSettings />

      {isAdmin && (
        <Link
          href="/admin"
          className="flex items-center gap-3 rounded-2xl border border-border p-4 transition-colors hover:bg-muted active:scale-[0.99]"
        >
          <BarChart3 className="size-[1.15rem] text-muted-foreground" />
          <span className="flex-1 text-[0.9rem] font-medium">
            Panel de administración
          </span>
          <ChevronRight className="size-4 text-muted-foreground" />
        </Link>
      )}

      <a
        href={`https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(
          'Hola, necesito ayuda con RagBox',
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 rounded-2xl border border-border p-4 transition-colors hover:bg-muted active:scale-[0.99]"
      >
        <LifeBuoy className="size-[1.15rem] text-muted-foreground" />
        <span className="flex-1 text-[0.9rem] font-medium">Soporte</span>
        <ChevronRight className="size-4 text-muted-foreground" />
      </a>

      <button
        type="button"
        onClick={signOut}
        className="flex w-full items-center justify-center gap-2 rounded-full border border-border py-3 text-[0.9rem] font-medium text-destructive transition-colors hover:bg-muted"
      >
        <LogOut className="size-[1.05rem]" />
        Cerrar sesión
      </button>
    </div>
  )
}

function ProfileSettings() {
  const { user, profile, supabase, refreshProfile } = useAuth()
  const [fullName, setFullName] = useState(profile?.full_name ?? '')
  const [whatsapp, setWhatsapp] = useState(profile?.whatsapp ?? '')
  const [saving, setSaving] = useState(false)
  const [open, setOpen] = useState(false)

  async function save(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    if (!fullName.trim() || !whatsapp.trim()) {
      toast.error('Completá tu nombre y tu WhatsApp')
      return
    }
    setSaving(true)
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      full_name: fullName.trim(),
      whatsapp: normalizeWhatsApp(whatsapp),
    })
    setSaving(false)
    if (error) {
      toast.error('No se pudo guardar')
      return
    }
    await refreshProfile()
    toast.success('Perfil actualizado')
  }

  return (
    <section className="rounded-[1.4rem] border border-border">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-center justify-between px-4 py-3.5"
      >
        <span className="text-[0.9rem] font-semibold">Ajustes de cuenta</span>
        <ChevronRight
          className={`size-4 text-muted-foreground transition-transform ${
            open ? 'rotate-90' : ''
          }`}
        />
      </button>
      {open && (
        <form onSubmit={save} className="space-y-3.5 border-t border-border p-4">
          <SettingsField label="Nombre y apellido">
            <input
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="María García"
              className="h-11 w-full rounded-xl bg-muted px-3.5 text-[0.9rem] outline-none focus:ring-2 focus:ring-foreground/10"
            />
          </SettingsField>
          <SettingsField label="Tu WhatsApp">
            <input
              value={whatsapp}
              onChange={e => setWhatsapp(e.target.value)}
              type="tel"
              inputMode="tel"
              placeholder="11 1234-5678"
              className="h-11 w-full rounded-xl bg-muted px-3.5 text-[0.9rem] outline-none focus:ring-2 focus:ring-foreground/10"
            />
          </SettingsField>
          <p className="text-[0.75rem] text-muted-foreground">
            Tu comunidad es Wellspring School.
          </p>
          <button
            type="submit"
            disabled={saving}
            className="flex h-11 w-full items-center justify-center rounded-full bg-primary text-[0.9rem] font-semibold text-primary-foreground transition-transform active:scale-[0.98] disabled:opacity-60"
          >
            {saving ? <Loader2 className="size-4 animate-spin" /> : 'Guardar cambios'}
          </button>
        </form>
      )}
    </section>
  )
}

function QuickAction({
  href,
  icon,
  label,
}: {
  href: string
  icon: React.ReactNode
  label: string
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 rounded-2xl border border-border p-3.5 transition-colors hover:bg-muted active:scale-[0.98]"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
        {icon}
      </span>
      <span className="text-[0.85rem] font-semibold leading-tight">{label}</span>
    </Link>
  )
}

function TrustRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3 py-1.5">
      <span className="text-muted-foreground">{icon}</span>
      <span className="text-[0.85rem] text-muted-foreground">{label}</span>
      <span className="ml-auto truncate text-[0.85rem] font-medium">{value}</span>
    </div>
  )
}

function SettingsField({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[0.8rem] font-semibold">{label}</label>
      {children}
    </div>
  )
}
