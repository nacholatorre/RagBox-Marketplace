import { AppHeader } from '@/components/layout/AppHeader'
import { AuthGate } from '@/components/auth/AuthGate'
import { FavoritesScreen } from '@/components/listings/FavoritesScreen'

export default function FavoritosPage() {
  return (
    <div>
      <AppHeader
        title="Favoritos"
        subtitle="Guardá productos para verlos después."
      />
      <AuthGate
        title="Tus favoritos"
        description="Iniciá sesión para guardar avisos y verlos acá."
      >
        <FavoritesScreen />
      </AuthGate>
    </div>
  )
}
