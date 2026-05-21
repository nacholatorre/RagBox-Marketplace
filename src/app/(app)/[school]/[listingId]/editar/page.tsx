import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getSchoolBySlug, getListing } from '@/lib/queries'
import { AppHeader } from '@/components/layout/AppHeader'
import { AuthGate } from '@/components/auth/AuthGate'
import { PublishForm } from '@/components/listings/PublishForm'

interface Props {
  params: Promise<{ school: string; listingId: string }>
}

export default async function EditListingPage({ params }: Props) {
  const { school: slug, listingId } = await params

  const [school, listing] = await Promise.all([
    getSchoolBySlug(slug),
    getListing(listingId),
  ])

  if (!school || !listing || listing.school_id !== school.id) notFound()

  // Solo el dueño edita su aviso.
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user || user.id !== listing.seller_id) notFound()

  return (
    <div>
      <AppHeader title="Editar publicación" backHref={`/${slug}/${listingId}`} />
      <AuthGate
        title="Editá tu publicación"
        description="Iniciá sesión para editar este aviso."
      >
        <PublishForm school={school} editListing={listing} />
      </AuthGate>
    </div>
  )
}
