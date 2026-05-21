'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Loader2, PackageOpen, Plus } from 'lucide-react'
import { toast } from 'sonner'
import type { Listing, ListingStatus } from '@/types'
import { useAuth } from '@/hooks/useAuth'
import { formatPrice } from '@/lib/formatters'
import { categoryIcon } from '@/lib/constants'
import { EmptyState } from '@/components/common/EmptyState'
import { cn } from '@/lib/utils'

type Row = Listing & { school: { slug: string } | null }

const STATUS_LABEL: Record<ListingStatus, string> = {
  active: 'Disponible',
  reserved: 'Reservado',
  sold: 'Vendido',
  paused: 'Pausado',
  fulfilled: 'Resuelto',
}

export function MyListingsScreen() {
  const { user, supabase } = useAuth()
  const [rows, setRows] = useState<Row[] | null>(null)
  const [busy, setBusy] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    supabase
      .from('listings')
      .select('*, school:schools(slug)')
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => setRows((data as Row[]) ?? []))
  }, [user, supabase])

  async function setStatus(id: string, status: ListingStatus) {
    setBusy(id)
    const { error } = await supabase.from('listings').update({ status }).eq('id', id)
    setBusy(null)
    if (error) return toast.error('No se pudo actualizar')
    setRows(prev => prev?.map(r => (r.id === id ? { ...r, status } : r)) ?? null)
    toast.success('Aviso actualizado')
  }

  async function remove(id: string) {
    setBusy(id)
    const { error } = await supabase.from('listings').delete().eq('id', id)
    setBusy(null)
    if (error) return toast.error('No se pudo eliminar')
    setRows(prev => prev?.filter(r => r.id !== id) ?? null)
    toast.success('Aviso eliminado')
  }

  if (rows === null) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (rows.length === 0) {
    return (
      <EmptyState
        icon={<PackageOpen className="size-7" strokeWidth={1.6} />}
        title="No publicaste nada"
        description="Cuando publiques un aviso vas a poder gestionarlo desde acá."
        action={
          <Link
            href="/"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-[0.95rem] font-semibold text-primary-foreground"
          >
            <Plus className="size-4" />
            Publicar
          </Link>
        }
      />
    )
  }

  return (
    <div className="space-y-3 px-5 py-4">
      {rows.map(row => {
        const RowIcon = categoryIcon(row.category)
        const isMessage = row.type !== 'sell'
        const closed =
          row.status === 'sold' ||
          row.status === 'paused' ||
          row.status === 'fulfilled'
        return (
        <div key={row.id} className="rounded-[1.4rem] border border-border p-3">
          <div className="flex gap-3">
            <Link
              href={row.school ? `/${row.school.slug}/${row.id}` : '#'}
              className="relative size-[4.25rem] shrink-0 overflow-hidden rounded-[1rem] bg-muted"
            >
              {row.images?.[0] ? (
                <Image src={row.images[0]} alt="" fill className="object-cover" sizes="68px" />
              ) : (
                <span className="flex h-full items-center justify-center">
                  <RowIcon className="size-6 text-muted-foreground/40" strokeWidth={1.5} />
                </span>
              )}
            </Link>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[0.9rem] font-semibold">{row.title}</p>
              <p className="text-[0.95rem] font-semibold tracking-tight">
                {isMessage
                  ? 'Mensaje del Tablón'
                  : formatPrice(row.price, row.price_mode)}
              </p>
              {!isMessage && (
                <span
                  className={cn(
                    'mt-1 inline-block rounded-full px-2 py-0.5 text-[0.65rem] font-semibold',
                    row.status === 'active' && 'bg-foreground text-background',
                    row.status === 'reserved' && 'bg-accent text-accent-foreground',
                    (row.status === 'sold' ||
                      row.status === 'paused' ||
                      row.status === 'fulfilled') &&
                      'bg-muted text-muted-foreground',
                  )}
                >
                  {STATUS_LABEL[row.status]}
                </span>
              )}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {!isMessage &&
              (closed ? (
                <ActionBtn
                  disabled={busy === row.id}
                  onClick={() => setStatus(row.id, 'active')}
                >
                  Reactivar
                </ActionBtn>
              ) : (
                <>
                  {row.status === 'active' && (
                    <ActionBtn
                      disabled={busy === row.id}
                      onClick={() => setStatus(row.id, 'reserved')}
                    >
                      Reservar
                    </ActionBtn>
                  )}
                  {row.status === 'reserved' && (
                    <ActionBtn
                      disabled={busy === row.id}
                      onClick={() => setStatus(row.id, 'active')}
                    >
                      Disponible
                    </ActionBtn>
                  )}
                  <ActionBtn
                    disabled={busy === row.id}
                    onClick={() => setStatus(row.id, 'sold')}
                  >
                    Vendido
                  </ActionBtn>
                </>
              ))}
            <button
              type="button"
              disabled={busy === row.id}
              onClick={() => remove(row.id)}
              className="h-10 rounded-full bg-destructive/10 px-4 text-[0.85rem] font-semibold text-destructive transition-colors hover:bg-destructive/20 disabled:opacity-50"
            >
              Eliminar
            </button>
          </div>
        </div>
        )
      })}
    </div>
  )
}

function ActionBtn({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void
  disabled?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="h-10 flex-1 rounded-full border border-border text-[0.85rem] font-semibold transition-colors hover:bg-muted disabled:opacity-50"
    >
      {children}
    </button>
  )
}
