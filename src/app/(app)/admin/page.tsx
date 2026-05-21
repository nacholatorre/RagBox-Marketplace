import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ADMIN_EMAIL } from '@/lib/constants'
import { getAdminMetrics, type AdminRange } from '@/lib/queries'
import { AppHeader } from '@/components/layout/AppHeader'
import { AdminDashboard } from '@/components/admin/AdminDashboard'

const VALID_RANGES: AdminRange[] = ['today', '7d', '30d', 'all']

function parseRange(v: string | undefined): AdminRange {
  if (v && (VALID_RANGES as string[]).includes(v)) return v as AdminRange
  return '7d'
}

interface Props {
  searchParams: Promise<Record<string, string | undefined>>
}

export default async function AdminPage({ searchParams }: Props) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.email !== ADMIN_EMAIL) notFound()

  const sp = await searchParams
  const range = parseRange(sp.range)
  const metrics = await getAdminMetrics(range)

  return (
    <div>
      <AppHeader title="Panel de administración" backHref="/perfil" />
      <AdminDashboard metrics={metrics} />
    </div>
  )
}
