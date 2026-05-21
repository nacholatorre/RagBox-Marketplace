import { Users, Package, MessageCircle } from 'lucide-react'
import type { AdminMetrics } from '@/lib/queries'

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function AdminDashboard({ metrics }: { metrics: AdminMetrics }) {
  const { users, listingCount, contactCount, topListings } = metrics

  return (
    <div className="space-y-7 px-5 py-4">
      {/* Totales */}
      <div className="grid grid-cols-3 gap-2.5">
        <Stat icon={<Users className="size-4" />} value={users.length} label="Familias" />
        <Stat icon={<Package className="size-4" />} value={listingCount} label="Avisos" />
        <Stat
          icon={<MessageCircle className="size-4" />}
          value={contactCount}
          label="Contactos"
        />
      </div>

      {/* Avisos más contactados */}
      {topListings.length > 0 && (
        <section>
          <h2 className="mb-2.5 text-[0.95rem] font-semibold tracking-tight">
            Avisos más contactados
          </h2>
          <div className="space-y-1.5">
            {topListings.map(l => (
              <div
                key={l.id}
                className="flex items-center gap-3 rounded-2xl border border-border px-3.5 py-3"
              >
                <p className="min-w-0 flex-1 truncate text-[0.85rem] font-medium">
                  {l.title}
                </p>
                <span className="shrink-0 rounded-full bg-foreground px-2.5 py-1 text-[0.7rem] font-semibold text-background">
                  {l.contacts} {l.contacts === 1 ? 'contacto' : 'contactos'}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

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
                  <a
                    href={`https://wa.me/${u.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 rounded-full bg-muted px-3 py-1.5 text-[0.78rem] font-medium tabular-nums transition-colors hover:bg-accent"
                  >
                    {u.whatsapp}
                  </a>
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

function Stat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode
  value: number
  label: string
}) {
  return (
    <div className="rounded-2xl border border-border p-3.5">
      <span className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
        {icon}
      </span>
      <p className="mt-2 text-[1.5rem] font-semibold tracking-tight tabular-nums">
        {value}
      </p>
      <p className="text-[0.72rem] font-medium text-muted-foreground">{label}</p>
    </div>
  )
}
