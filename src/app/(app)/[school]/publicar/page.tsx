import { notFound } from 'next/navigation'
import { getSchoolBySlug } from '@/lib/queries'
import { AppHeader } from '@/components/layout/AppHeader'
import { AuthGate } from '@/components/auth/AuthGate'
import { PublishForm } from '@/components/listings/PublishForm'

interface Props {
  params: Promise<{ school: string }>
  searchParams: Promise<Record<string, string | undefined>>
}

function parseMode(raw: string | undefined): 'sell' | 'message' {
  return raw === 'mensaje' ? 'message' : 'sell'
}

export default async function PublicarPage({ params, searchParams }: Props) {
  const { school: slug } = await params
  const { tipo } = await searchParams
  const school = await getSchoolBySlug(slug)
  if (!school) notFound()

  return (
    <div>
      <AppHeader title="Publicar" backHref={`/${slug}`} />
      <AuthGate
        title="Publicá en tu colegio"
        description="Iniciá sesión para vender un producto o escribir en el Tablón."
      >
        <PublishForm school={school} initialMode={parseMode(tipo)} />
      </AuthGate>
    </div>
  )
}
