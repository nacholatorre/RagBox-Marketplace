interface Props {
  label: string
  value: number
  max: number
  /** Color de la barra (tailwind class). Default primary. */
  tone?: 'primary' | 'whatsapp' | 'foreground'
}

export function MetricBar({ label, value, max, tone = 'foreground' }: Props) {
  const pct = max > 0 ? Math.max(4, Math.round((value / max) * 100)) : 0
  const barClass =
    tone === 'whatsapp'
      ? 'bg-whatsapp'
      : tone === 'primary'
        ? 'bg-primary'
        : 'bg-foreground'

  return (
    <div className="flex items-center gap-3">
      <span className="w-28 shrink-0 text-[0.82rem] font-medium text-foreground/80">
        {label}
      </span>
      <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-muted">
        {value > 0 && (
          <span
            className={`absolute inset-y-0 left-0 ${barClass}`}
            style={{ width: `${pct}%` }}
          />
        )}
      </div>
      <span className="w-10 shrink-0 text-right text-[0.82rem] font-semibold tabular-nums">
        {value}
      </span>
    </div>
  )
}
