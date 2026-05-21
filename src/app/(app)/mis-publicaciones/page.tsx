import { AppHeader } from '@/components/layout/AppHeader'
import { AuthGate } from '@/components/auth/AuthGate'
import { MyListingsScreen } from '@/components/listings/MyListingsScreen'

export default function MisPublicacionesPage() {
  return (
    <div>
      <AppHeader title="Mis publicaciones" backHref="/perfil" />
      <AuthGate
        title="Tus publicaciones"
        description="Iniciá sesión para gestionar tus avisos."
      >
        <MyListingsScreen />
      </AuthGate>
    </div>
  )
}
