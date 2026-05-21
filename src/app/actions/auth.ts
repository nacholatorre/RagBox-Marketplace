'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { normalizeWhatsApp } from '@/lib/whatsapp'

const EMAIL_DOMAIN = 'ragbox.app'
const PASSWORD_PREFIX = 'wsp-rgbx-'

export type EnsureUserResult =
  | { ok: true; email: string; password: string; digits: string }
  | {
      ok: false
      error: 'name' | 'whatsapp' | 'missing-key' | 'unknown'
      message?: string
    }

/**
 * Crea (o asegura) un usuario de RagBox a partir del nombre + WhatsApp.
 *
 * Usa el service_role de Supabase para crear el usuario con `email_confirm: true`,
 * salteando el toggle "Confirm email" del dashboard. Devuelve email + password
 * determinísticos para que el cliente pueda hacer signInWithPassword después.
 *
 * Si el usuario ya existía (por ejemplo, de un signup magic-link previo), le
 * normaliza el password al valor que el cliente va a usar y confirma el email.
 */
export async function ensureRagBoxUser(input: {
  fullName: string
  whatsapp: string
}): Promise<EnsureUserResult> {
  const name = input.fullName.trim()
  const digits = normalizeWhatsApp(input.whatsapp)

  if (!name) return { ok: false, error: 'name' }
  if (digits.length < 8) return { ok: false, error: 'whatsapp' }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { ok: false, error: 'missing-key' }
  }

  const email = `${digits}@${EMAIL_DOMAIN}`
  const password = `${PASSWORD_PREFIX}${digits}`

  let admin
  try {
    admin = createAdminClient()
  } catch (err) {
    return {
      ok: false,
      error: 'missing-key',
      message: err instanceof Error ? err.message : 'admin client',
    }
  }

  // Intentar crear nuevo. Con email_confirm: true el usuario queda listo para
  // hacer signInWithPassword inmediatamente, sin esperar ningún mail.
  const create = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: name },
  })

  let userId: string | undefined = create.data.user?.id ?? undefined

  if (create.error) {
    const errMsg = create.error.message.toLowerCase()
    if (!errMsg.includes('already') && !errMsg.includes('exists') && !errMsg.includes('registered')) {
      return { ok: false, error: 'unknown', message: create.error.message }
    }

    // El usuario ya existía. Lo buscamos para resetear el password al valor
    // determinístico y asegurar email_confirm (en caso de venir de magic link).
    const { data: list, error: listErr } = await admin.auth.admin.listUsers({
      page: 1,
      perPage: 200,
    })
    if (listErr) {
      return { ok: false, error: 'unknown', message: listErr.message }
    }

    const existing = list?.users.find(u => u.email === email)
    if (existing) {
      userId = existing.id
      const upd = await admin.auth.admin.updateUserById(existing.id, {
        password,
        email_confirm: true,
        user_metadata: {
          ...(existing.user_metadata ?? {}),
          full_name: name,
        },
      })
      if (upd.error) {
        return { ok: false, error: 'unknown', message: upd.error.message }
      }
    }
  }

  // Grabamos el perfil completo AHORA, con el admin client (bypass RLS). Así
  // cuando el cliente haga signInWithPassword y el provider cargue el perfil,
  // ya viene completo y no hay carrera con el upsert del lado del browser.
  if (userId) {
    const { error: upsertErr } = await admin
      .from('profiles')
      .upsert({ id: userId, full_name: name, whatsapp: digits })
    if (upsertErr) {
      return { ok: false, error: 'unknown', message: upsertErr.message }
    }
  }

  return { ok: true, email, password, digits }
}
