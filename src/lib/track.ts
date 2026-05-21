import type { SupabaseClient } from '@supabase/supabase-js'

const SESSION_KEY = 'rgbx:sid'

/** Devuelve (o crea) un session_id anonimo en localStorage. */
function getSessionId(): string {
  if (typeof window === 'undefined') return 'ssr'
  try {
    let sid = window.localStorage.getItem(SESSION_KEY)
    if (!sid) {
      sid = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
      window.localStorage.setItem(SESSION_KEY, sid)
    }
    return sid
  } catch {
    return 'no-ls'
  }
}

export interface TrackPayload {
  event_name: string
  school_id?: string | null
  listing_id?: string | null
  seller_id?: string | null
  user_id?: string | null
  metadata?: Record<string, unknown>
}

/**
 * Fire-and-forget. NUNCA bloquea el flujo (ej. apertura de WhatsApp) y
 * silencia errores — el tracking no puede romper la UX.
 */
export function trackEvent(supabase: SupabaseClient, payload: TrackPayload): void {
  try {
    supabase
      .from('events')
      .insert({
        ...payload,
        metadata: payload.metadata ?? {},
        session_id: getSessionId(),
      })
      .then(
        () => {},
        () => {},
      )
  } catch {
    // no-op
  }
}
