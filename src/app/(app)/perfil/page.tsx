import { AppHeader } from '@/components/layout/AppHeader'
import { AuthGate } from '@/components/auth/AuthGate'
import { ProfileHub } from '@/components/profile/ProfileHub'

export default function PerfilPage() {
  return (
    <div>
      <AppHeader title="Mi perfil" />
      <AuthGate
        title="Tu perfil"
        description="Iniciá sesión para ver y editar tu perfil."
      >
        <ProfileHub />
      </AuthGate>
    </div>
  )
}
