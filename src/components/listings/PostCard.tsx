import Link from 'next/link'
import { Camera } from 'lucide-react'
import type { Listing, ListingType } from '@/types'
import { formatRelativeDate } from '@/lib/formatters'
import { cn } from '@/lib/utils'

/** Meta visual de la etiqueta del Tablón (BUSCO / DONO / AVISO). */
export function postTagMeta(type: ListingType): { label: string; className: string } | null {
  switch (type) {
    case 'request':
      return {
        label: 'BUSCO',
        className: 'bg-foreground/10 text-foreground',
      }
    case 'donation':
      return {
        label: 'DONO',
        className: 'bg-whatsapp/15 text-whatsapp',
      }
    case 'announcement':
      return {
        label: 'AVISO',
        className: 'bg-primary/12 text-primary',
      }
    default:
      return null
  }
}

/** Fila de un mensaje del Tablón — estilo feed (texto, sin foto en la lista). */
export function PostCard({
  post,
  schoolSlug,
}: {
  post: Listing
  schoolSlug: string
}) {
  const hasPhoto = Array.isArray(post.images) && post.images.length > 0
  const tag = postTagMeta(post.type)

  return (
    <Link
      href={`/${schoolSlug}/${post.id}`}
      className="flex gap-3 border-b border-border px-5 py-4 transition-colors active:bg-muted/50"
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-foreground text-[0.9rem] font-semibold text-background">
        {post.seller_name.charAt(0).toUpperCase()}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5 text-[0.8rem]">
          {tag && (
            <span
              className={cn(
                'rounded-md px-1.5 py-0.5 text-[0.65rem] font-bold tracking-[0.04em]',
                tag.className,
              )}
            >
              {tag.label}
            </span>
          )}
          <span className="truncate font-semibold">{post.seller_name}</span>
          <span className="shrink-0 text-muted-foreground">
            · {formatRelativeDate(post.created_at)}
          </span>
        </div>
        <p className="mt-1 whitespace-pre-wrap break-words text-[0.95rem] leading-relaxed">
          {post.title}
        </p>
        {hasPhoto && (
          <span className="mt-2 inline-flex items-center gap-1 text-[0.72rem] font-medium text-muted-foreground">
            <Camera className="size-3.5" strokeWidth={2} />
            Tiene foto
          </span>
        )}
      </div>
    </Link>
  )
}
