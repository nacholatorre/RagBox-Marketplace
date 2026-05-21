import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ADMIN_EMAIL } from '@/lib/constants'
import { getAdminMetrics } from '@/lib/queries'
import { AppHeader } from '@/components/layout/AppHeader'
import { AdminDashboard } from '@/components/admin/AdminDashboard'

export default async function AdminPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Solo el dueño del piloto entra acá.
  if (!user || user.email !== ADMIN_EMAIL) notFound()

  const metrics = await getAdminMetrics()

  return (
    <div>
      <AppHeader title="Panel de administración" backHref="/perfil" />
      <AdminDashboard metrics={metrics} />
    </div>
  )
}
