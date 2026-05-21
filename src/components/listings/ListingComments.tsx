'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Loader2, Send } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import { formatRelativeDate } from '@/lib/formatters'

interface CommentRow {
  id: string
  body: string
  created_at: string
  author: { id: string; full_name: string | null; avatar_url: string | null } | null
}

export function ListingComments({ listingId }: { listingId: string }) {
  const { user, isAuthed, supabase } = useAuth()
  const [comments, setComments] = useState<CommentRow[] | null>(null)
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    supabase
      .from('comments')
      .select('id,body,created_at,author:profiles(id,full_name,avatar_url)')
      .eq('listing_id', listingId)
      .order('created_at', { ascending: true })
      .then(({ data }) => setComments((data as unknown as CommentRow[]) ?? []))
  }, [listingId, supabase])

  async function send(e: React.FormEvent) {
    e.preventDefault()
    const body = draft.trim()
    if (!body || !user || sending) return
    setSending(true)
    const { data, error } = await supabase
      .from('comments')
      .insert({ listing_id: listingId, author_id: user.id, body })
      .select('id,body,created_at,author:profiles(id,full_name,avatar_url)')
      .single()
    setSending(false)
    if (error) {
      toast.error('No se pudo enviar la pregunta')
      return
    }
    setDraft('')
    setComments(prev => [...(prev ?? []), data as unknown as CommentRow])
  }

  return (
    <section className="mt-7">
      <h2 className="text-[0.95rem] font-semibold tracking-tight">
        Preguntas
        {comments && comments.length > 0 && (
          <span className="text-muted-foreground"> ({comments.length})</span>
        )}
      </h2>

      <div className="mt-3 space-y-3">
        {comments === null ? (
          <div className="flex justify-center py-4">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : comments.length === 0 ? (
          <p className="text-[0.85rem] text-muted-foreground">
            Todavía no hay preguntas. Sé el primero en preguntar.
          </p>
        ) : (
          comments.map(c => (
            <div key={c.id} className="flex gap-2.5">
              <div className="relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-foreground text-[0.7rem] font-semibold text-background">
                {c.author?.avatar_url ? (
                  <Image src={c.author.avatar_url} alt="" fill className="object-cover" sizes="32px" />
                ) : (
                  (c.author?.full_name ?? 'F').charAt(0).toUpperCase()
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[0.8rem]">
                  <span className="font-semibold">
                    {c.author?.full_name ?? 'Familia'}
                  </span>
                  <span className="ml-1.5 text-[0.72rem] text-muted-foreground">
                    {formatRelativeDate(c.created_at)}
                  </span>
                </p>
                <p className="text-[0.88rem] leading-relaxed text-muted-foreground">
                  {c.body}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {isAuthed ? (
        <form onSubmit={send} className="mt-4 flex items-center gap-2">
          <input
            value={draft}
            onChange={e => setDraft(e.target.value)}
            maxLength={300}
            placeholder="Escribí una pregunta…"
            className="h-11 flex-1 rounded-full bg-muted px-4 text-[0.9rem] outline-none focus:ring-2 focus:ring-foreground/10"
          />
          <button
            type="submit"
            disabled={!draft.trim() || sending}
            aria-label="Enviar"
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform active:scale-90 disabled:opacity-40"
          >
            {sending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-[1.05rem]" />
            )}
          </button>
        </form>
      ) : (
        <Link
          href="/login"
          className="mt-4 flex h-11 items-center justify-center rounded-full border border-border text-[0.88rem] font-semibold transition-colors hover:bg-muted"
        >
          Iniciá sesión para preguntar
        </Link>
      )}
    </section>
  )
}
