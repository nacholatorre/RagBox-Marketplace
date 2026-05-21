import { Package, ShoppingBag, Star, Calendar } from 'lucide-react'

interface Props {
  activeCount: number
  soldCount: number
  ratingAvg: number
  ratingCount: number
  memberSince: string | null
}

export function SellerStats({
  activeCount,
  soldCount,
  ratingAvg,
  ratingCount,
  memberSince,
}: Props) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      <StatCard
        icon={<Package className="size-4" strokeWidth={1.8} />}
        value={activeCount.toString()}
        label={activeCount === 1 ? 'Publicación activa' : 'Publicaciones activas'}
      />
      <StatCard
        icon={<ShoppingBag className="size-4" strokeWidth={1.8} />}
        value={soldCount.toString()}
        label={soldCount === 1 ? 'Vendido / donado' : 'Vendidos / donados'}
      />
      <StatCard
        icon={<Star className="size-4" strokeWidth={1.8} />}
        value={ratingCount > 0 ? ratingAvg.toFixed(1) : '—'}
        label={
          ratingCount > 0
            ? `${ratingCount} ${ratingCount === 1 ? 'calificación' : 'calificaciones'}`
            : 'Sin calificaciones'
        }
      />
      <StatCard
        icon={<Calendar className="size-4" strokeWidth={1.8} />}
        value={memberSince ?? '—'}
        label="En RagBox desde"
      />
    </div>
  )
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode
  value: string
  label: string
}) {
  return (
    <div className="rounded-2xl border border-border p-3.5">
      <span className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
        {icon}
      </span>
      <p className="mt-2 truncate text-[1.05rem] font-semibold tracking-tight tabular-nums">
        {value}
      </p>
      <p className="truncate text-[0.7rem] font-medium text-muted-foreground">
        {label}
      </p>
    </div>
  )
}
