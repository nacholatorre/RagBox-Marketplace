import { createClient } from '@/lib/supabase/server'
import { getListingsBySeller } from '@/lib/queries'
import { AppHeader } from '@/components/layout/AppHeader'
import { AuthGate } from '@/components/auth/AuthGate'
import { ProfileHub } from '@/components/profile/ProfileHub'

export default async function PerfilPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const listings = user ? await getListingsBySeller(user.id) : []

  return (
    <div>
      <AppHeader title="Mi perfil" />
      <AuthGate
        title="Tu perfil"
        description="Iniciá sesión para ver y editar tu perfil."
      >
        <ProfileHub initialListings={listings} />
      </AuthGate>
    </div>
  )
}
