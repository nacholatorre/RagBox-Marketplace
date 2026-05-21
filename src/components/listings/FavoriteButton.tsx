'use client'

import { useRouter } from 'next/navigation'
import { Heart } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import { useFavorites } from '@/context/FavoritesProvider'
import { cn } from '@/lib/utils'

interface Props {
  listingId: string
  variant?: 'overlay' | 'plain'
  className?: string
}

export function FavoriteButton({ listingId, variant = 'overlay', className }: Props) {
  const { isAuthed } = useAuth()
  const { isFavorite, toggle } = useFavorites()
  const router = useRouter()
  const active = isFavorite(listingId)

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!isAuthed) {
      toast('Iniciá sesión para guardar favoritos')
      router.push('/login')
      return
    }
    await toggle(listingId)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={active ? 'Quitar de favoritos' : 'Guardar en favoritos'}
      aria-pressed={active}
      className={cn(
        'flex items-center justify-center transition-transform duration-150 active:scale-[0.8]',
        variant === 'overlay' &&
          'size-9 rounded-full bg-background/80 shadow-soft backdrop-blur-md',
        variant === 'plain' && 'size-12 rounded-full border border-border bg-background',
        className,
      )}
    >
      <Heart
        className={cn(
          'size-[1.15rem] transition-all duration-200',
          active ? 'scale-110 fill-like text-like' : 'text-foreground',
        )}
        strokeWidth={2}
      />
    </button>
  )
}
