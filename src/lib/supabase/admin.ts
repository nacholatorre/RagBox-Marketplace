import 'server-only'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let cached: SupabaseClient | null = null

/**
 * Cliente admin de Supabase. Usa la SERVICE_ROLE_KEY — saltea RLS y puede crear
 * usuarios sin confirmación de email. NUNCA se importa desde un componente
 * cliente; vive solo en Server Actions / Route Handlers.
 */
export function createAdminClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url) throw new Error('Falta NEXT_PUBLIC_SUPABASE_URL')
  if (!key) {
    throw new Error(
      'Falta SUPABASE_SERVICE_ROLE_KEY en .env.local. Copialo desde Supabase → Settings → API → service_role (secret).',
    )
  }

  if (!cached) {
    cached = createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  }
  return cached
}
