import {
  Users,
  Package,
  MessageCircle,
  Tag,
  Search,
  Gift,
  CheckCircle2,
  Eye,
  Activity,
  Sparkles,
  PackagePlus,
} from 'lucide-react'
import type { AdminMetrics } from '@/lib/queries'
import { CATEGORIES, categoryLabel, listingTypeLabel } from '@/lib/constants'
import { formatPrice } from '@/lib/formatters'
import { RangeFilter } from './RangeFilter'
import { MaskedPhone } from './MaskedPhone'
import { MetricBar } from './MetricBar'

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const RANGE_LABEL: Record<AdminMetrics['range'], string> = {
  today: 'hoy',
  '7d': 'últimos 7 días',
  '30d': 'últimos 30 días',
  all: 'todo el tiempo',
}

export function AdminDashboard({ metrics }: { metrics: AdminMetrics }) {
  const {
    range,
    users,
    totals,
    contactRate,
    publishFunnel,
    contactsByType,
    contactsByCategory,
    topListings,
  } = metrics
  const maxType = Math.max(contactsByType.sell, contactsByType.request, contactsByType.donation, 1)
  const maxCat = Math.max(...contactsByCategory.map(c => c.count), 1)

  return (
    <div className="space-y-7 px-5 py-4">
      {/* Filtro de rango */}
      <div>
        <p className="mb-2 text-[0.78rem] font-medium text-muted-foreground">
          Métricas del rango seleccionado
        </p>
        <RangeFilter active={range} />
      </div>

      {/* Resumen principal */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        <Stat icon={<Users className="size-4" />} value={`${totals.families}`} label="Familias" />
        <Stat icon={<Package className="size-4" />} value={`${totals.listings}`} label="Avisos" />
        <Stat
          icon={<Eye className="size-4" />}
          value={`${totals.views}`}
          label={`Vistas · ${RANGE_LABEL[range]}`}
        />
        <Stat
          icon={<MessageCircle className="size-4" />}
          value={`${totals.contacts}`}
          label={`Contactos · ${RANGE_LABEL[range]}`}
          accent
        />
        <Stat
          icon={<Activity className="size-4" />}
          value={contactRate == null ? '—' : `${contactRate.toFixed(1)}%`}
          label="Tasa de contacto"
        />
      </div>

      {/* Embudo de publicación */}
      <section>
        <h2 className="mb-2.5 text-[0.95rem] font-semibold tracking-tight">
          Embudo de publicación · {RANGE_LABEL[range]}
        </h2>
        {publishFunnel.started === 0 ? (
          <EmptyHint text="Nadie empezó a publicar en este rango." />
        ) : (
          <div className="flex items-center gap-3 rounded-2xl border border-border p-4">
            <FunnelStep value={publishFunnel.started} label="Empezaron" />
            <span className="text-muted-foreground">→</span>
            <FunnelStep value={publishFunnel.completed} label="Completaron" />
            <span className="ml-auto rounded-full bg-primary/12 px-3 py-1.5 text-[0.8rem] font-semibold text-primary">
              {publishFunnel.conversionPct.toFixed(0)}% conversión
            </span>
          </div>
        )}
      </section>

      {/* Estados de avisos */}
      <section>
        <h2 className="mb-2.5 text-[0.95rem] font-semibold tracking-tight">
          Estado de los avisos
        </h2>
        <div className="grid grid-cols-2 gap-2.5">
          <MiniStat icon={<Tag className="size-3.5" />} value={totals.activeListings} label="Activos" />
          <MiniStat
            icon={<CheckCircle2 className="size-3.5" />}
            value={totals.soldOrFulfilled}
            label="Vendidos / resueltos (total)"
          />
          <MiniStat icon={<Search className="size-3.5" />} value={totals.requests} label="Pedidos Busco" />
          <MiniStat icon={<Gift className="size-3.5" />} value={totals.donations} label="Donaciones" />
          <MiniStat
            icon={<PackagePlus className="size-3.5" />}
            value={totals.newListings}
            label={`Nuevos · ${RANGE_LABEL[range]}`}
          />
          <MiniStat
            icon={<Sparkles className="size-3.5" />}
            value={totals.closedInRange}
            label={`Cerrados · ${RANGE_LABEL[range]}`}
          />
        </div>
      </section>

      {/* Contactos por tipo */}
      <section>
        <h2 className="mb-2.5 text-[0.95rem] font-semibold tracking-tight">
          Contactos por tipo
        </h2>
        {totals.contacts === 0 ? (
          <EmptyHint text="Todavía no hay contactos en este rango." />
        ) : (
          <div className="space-y-2 rounded-2xl border border-border p-4">
            <MetricBar label="Vendo" value={contactsByType.sell} max={maxType} tone="primary" />
            <MetricBar label="Busco" value={contactsByType.request} max={maxType} tone="foreground" />
            <MetricBar label="Dono" value={contactsByType.donation} max={maxType} tone="whatsapp" />
          </div>
        )}
      </section>

      {/* Contactos por categoría */}
      <section>
        <h2 className="mb-2.5 text-[0.95rem] font-semibold tracking-tight">
          Contactos por categoría
        </h2>
        {contactsByCategory.length === 0 ? (
          <EmptyHint text="Todavía no hay contactos en este rango." />
        ) : (
          <div className="space-y-2 rounded-2xl border border-border p-4">
            {CATEGORIES.map(c => {
              const n = contactsByCategory.find(x => x.category === c.slug)?.count ?? 0
              return <MetricBar key={c.slug} label={c.label} value={n} max={maxCat} />
            })}
          </div>
        )}
      </section>

      {/* Top publicaciones contactadas */}
      <section>
        <h2 className="mb-2.5 text-[0.95rem] font-semibold tracking-tight">
          Top publicaciones contactadas
        </h2>
        {topListings.length === 0 ? (
          <EmptyHint text="Sin avisos contactados en este rango." />
        ) : (
          <div className="space-y-1.5">
            {topListings.map(l => (
              <div
                key={l.id}
                className="flex items-center gap-3 rounded-2xl border border-border px-3.5 py-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[0.85rem] font-medium">{l.title}</p>
                  <p className="mt-0.5 text-[0.7rem] text-muted-foreground">
                    {listingTypeLabel(l.type)} · {categoryLabel(l.category)}
                    {l.price != null && ` · ${formatPrice(l.price, 'fixed')}`}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-foreground px-2.5 py-1 text-[0.7rem] font-semibold text-background">
                  {l.contacts} {l.contacts === 1 ? 'contacto' : 'contactos'}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Familias registradas */}
      <section>
        <h2 className="mb-2.5 text-[0.95rem] font-semibold tracking-tight">
          Familias registradas ({users.length})
        </h2>
        {users.length === 0 ? (
          <p className="text-[0.85rem] text-muted-foreground">
            Todavía no hay familias registradas.
          </p>
        ) : (
          <div className="divide-y divide-border rounded-2xl border border-border">
            {users.map(u => (
              <div key={u.id} className="flex items-center gap-3 px-3.5 py-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-foreground text-[0.8rem] font-semibold text-background">
                  {(u.full_name ?? '?').charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[0.85rem] font-medium">
                    {u.full_name ?? 'Sin nombre'}
                  </p>
                  <p className="text-[0.72rem] text-muted-foreground">
                    Registrada el {fmtDate(u.created_at)}
                  </p>
                </div>
                {u.whatsapp ? (
                  <MaskedPhone phone={u.whatsapp} />
                ) : (
                  <span className="shrink-0 text-[0.72rem] text-muted-foreground">
                    sin WhatsApp
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function FunnelStep({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <p className="text-[1.5rem] font-semibold tabular-nums leading-none">{value}</p>
      <p className="mt-1 text-[0.7rem] font-medium text-muted-foreground">{label}</p>
    </div>
  )
}

function Stat({
  icon,
  value,
  label,
  accent,
}: {
  icon: React.ReactNode
  value: string
  label: string
  accent?: boolean
}) {
  return (
    <div className={`rounded-2xl border p-3.5 ${accent ? 'border-primary/30 bg-primary/[0.04]' : 'border-border'}`}>
      <span
        className={`flex size-8 items-center justify-center rounded-full ${
          accent ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
        }`}
      >
        {icon}
      </span>
      <p className="mt-2 text-[1.5rem] font-semibold tracking-tight tabular-nums">
        {value}
      </p>
      <p className="truncate text-[0.7rem] font-medium text-muted-foreground">
        {label}
      </p>
    </div>
  )
}

function MiniStat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode
  value: number
  label: string
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-2xl border border-border px-3.5 py-2.5">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[1rem] font-semibold tabular-nums">{value}</p>
        <p className="truncate text-[0.68rem] text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}

function EmptyHint({ text }: { text: string }) {
  return (
    <p className="rounded-2xl border border-dashed border-border px-4 py-3 text-[0.82rem] text-muted-foreground">
      {text}
    </p>
  )
}
