import type { ListingStatus } from '@/types'
import { getListingStatusLabel, isExpired } from '@/lib/formatters'
import { cn } from '@/lib/utils'

interface Props {
  status: ListingStatus
  expiresAt?: string
  className?: string
}

/** Badge de estado. No renderiza nada si el aviso está disponible y vigente. */
export function StatusBadge({ status, expiresAt, className }: Props) {
  const expired = status === 'active' && !!expiresAt && isExpired(expiresAt)
  if (status === 'active' && !expired) return null

  const tone =
    status === 'sold'
      ? 'bg-foreground text-background'
      : status === 'reserved'
        ? 'bg-background text-foreground shadow-soft'
        : 'bg-muted text-muted-foreground'

  return (
    <span
      className={cn(
        'rounded-full px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wide backdrop-blur',
        tone,
        className,
      )}
    >
      {getListingStatusLabel(status, expiresAt)}
    </span>
  )
}
