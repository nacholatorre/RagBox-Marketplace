import Image from 'next/image'
import { cn } from '@/lib/utils'

interface Props {
  name: string
  avatarUrl: string | null | undefined
  size?: number
  className?: string
}

/** Avatar circular del vendedor — foto si existe, inicial como fallback. */
export function SellerAvatar({ name, avatarUrl, size = 40, className }: Props) {
  const initial = (name?.charAt(0) ?? '?').toUpperCase()
  const dim = { width: size, height: size }

  if (avatarUrl) {
    return (
      <div
        style={dim}
        className={cn('relative overflow-hidden rounded-full bg-muted', className)}
      >
        <Image
          src={avatarUrl}
          alt=""
          fill
          sizes={`${size}px`}
          className="object-cover"
        />
      </div>
    )
  }

  return (
    <div
      style={dim}
      className={cn(
        'flex items-center justify-center rounded-full bg-foreground font-semibold text-background',
        className,
      )}
    >
      <span style={{ fontSize: size * 0.4 }}>{initial}</span>
    </div>
  )
}
