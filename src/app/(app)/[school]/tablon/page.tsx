import { Suspense } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MessagesSquare, PenLine } from 'lucide-react'
import { getSchoolBySlug, getBoardPosts } from '@/lib/queries'
import { AppHeader } from '@/components/layout/AppHeader'
import { PostCard } from '@/components/listings/PostCard'
import { TablonFilters } from '@/components/listings/TablonFilters'
import { EmptyState } from '@/components/common/EmptyState'

interface Props {
  params: Promise<{ school: string }>
  searchParams: Promise<Record<string, string | undefined>>
}

type Tab = 'todo' | 'busco' | 'dono' | 'avisos'

const TAB_TO_TYPE: Record<
  Exclude<Tab, 'todo'>,
  'request' | 'donation' | 'announcement'
> = {
  busco: 'request',
  dono: 'donation',
  avisos: 'announcement',
}

function parseTab(raw: string | undefined): Tab {
  if (raw === 'busco' || raw === 'dono' || raw === 'avisos') return raw
  return 'todo'
}

/** Tablón: feed de mensajes de la comunidad con etiquetas BUSCO / DONO / AVISO. */
export default async function TablonPage({ params, searchParams }: Props) {
  const { school: slug } = await params
  const sp = await searchParams
  const tab = parseTab(sp.tab)

  const school = await getSchoolBySlug(slug)
  if (!school) notFound()

  const posts = await getBoardPosts(
    school.id,
    tab === 'todo' ? undefined : TAB_TO_TYPE[tab],
  )

  return (
    <div>
      <AppHeader
        title="Tablón de la comunidad"
        subtitle="Buscá, doná o avisá algo al colegio."
        logoUrl={school.logo_url ?? undefined}
      />

      <div className="space-y-3 px-5 pb-3 pt-1.5">
        <Link
          href={`/${school.slug}/publicar?tipo=mensaje`}
          className="flex items-center gap-2.5 rounded-full border border-border px-4 py-3 text-[0.9rem] text-muted-foreground transition-colors active:bg-muted"
        >
          <PenLine className="size-[1.05rem]" />
          ¿Qué buscás o querés donar?
        </Link>

        <Suspense>
          <TablonFilters />
        </Suspense>
      </div>

      {posts.length === 0 ? (
        <EmptyState
          icon={<MessagesSquare className="size-7" strokeWidth={1.6} />}
          title={
            tab === 'todo'
              ? 'Todavía no hay mensajes'
              : 'Nada acá por ahora'
          }
          description={
            tab === 'todo'
              ? 'Sé la primera familia en escribir algo en el Tablón: buscá, ofrecé o avisá lo que quieras.'
              : 'Probá con otro filtro o publicá un mensaje nuevo.'
          }
          action={
            <Link
              href={`/${school.slug}/publicar?tipo=mensaje`}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-[0.95rem] font-semibold text-primary-foreground transition-transform active:scale-[0.97]"
            >
              <PenLine className="size-4" />
              Escribir un mensaje
            </Link>
          }
        />
      ) : (
        <div className="border-t border-border pb-10">
          {posts.map(post => (
            <PostCard key={post.id} post={post} schoolSlug={school.slug} />
          ))}
        </div>
      )}
    </div>
  )
}
