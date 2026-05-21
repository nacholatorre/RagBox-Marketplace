import type { Listing, ListingType } from '@/types'
import { formatPrice } from './formatters'

/** Normaliza un número a formato wa.me (dígitos, prefijo país Argentina). */
export function normalizeWhatsApp(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  if (digits.startsWith('54')) return digits
  if (digits.startsWith('0')) return `54${digits.slice(1)}`
  return `54${digits}`
}

interface WhatsAppParams {
  phone: string
  sellerName: string
  title: string
  priceLabel: string
  schoolName: string
  /** Tipo de publicación — define el tono del mensaje. */
  type?: ListingType
  /** Frase de cierre (la pregunta). Si se omite, se usa la del tipo. */
  closing?: string
}

/**
 * Arma un link de WhatsApp con el contexto de la publicación pre-cargado.
 * El mensaje se adapta: aviso de venta o mensaje del Tablón.
 */
export function buildWhatsAppUrl({
  phone,
  sellerName,
  title,
  priceLabel,
  schoolName,
  type = 'sell',
  closing,
}: WhatsAppParams): string {
  let intro: string
  let detailLines: string[]
  let defaultClosing: string

  if (type === 'sell') {
    intro = `Hola ${sellerName}, vi tu aviso en RagBox:`
    detailLines = [
      `Producto: ${title}`,
      `Precio: ${priceLabel}`,
      `Colegio: ${schoolName}`,
    ]
    defaultClosing = '¿Todavía está disponible?'
  } else {
    intro = `Hola ${sellerName}, vi tu mensaje en el Tablón de RagBox:`
    detailLines = [`«${title}»`, `Colegio: ${schoolName}`]
    defaultClosing = 'Te escribo por esto 🙂'
  }

  const message = [intro, '', ...detailLines, '', closing ?? defaultClosing].join(
    '\n',
  )
  return `https://wa.me/${normalizeWhatsApp(phone)}?text=${encodeURIComponent(message)}`
}

/** Atajo: construye el link de contacto a partir de una publicación. */
export function buildContactUrl(
  listing: Listing,
  schoolName: string,
  closing?: string,
): string {
  return buildWhatsAppUrl({
    phone: listing.seller_whatsapp,
    sellerName: listing.seller_name,
    title: listing.title,
    priceLabel: formatPrice(listing.price, listing.price_mode),
    schoolName,
    type: listing.type,
    closing,
  })
}

/** Preguntas rápidas pre-armadas para abrir WhatsApp con un cierre puntual. */
export type QuickQuestion = 'available' | 'more-photos' | 'pickup'

const QUICK_CLOSINGS: Record<QuickQuestion, string> = {
  available: '¿Sigue disponible?',
  'more-photos': '¿Me podrías pasar más fotos?',
  pickup: '¿Se puede retirar por el colegio?',
}

export function buildQuickQuestionUrl(
  listing: Listing,
  schoolName: string,
  question: QuickQuestion,
): string {
  return buildContactUrl(listing, schoolName, QUICK_CLOSINGS[question])
}

/** Texto para compartir una publicación (Web Share API / copiar). */
export function buildShareText(
  listing: Listing,
  schoolName: string,
  url: string,
): string {
  if (listing.type !== 'sell') {
    return [
      'Mirá este mensaje del Tablón de RagBox:',
      listing.title,
      schoolName,
      url,
    ].join('\n')
  }
  return [
    'Mirá este aviso en RagBox:',
    `${listing.title} — ${formatPrice(listing.price, listing.price_mode)}`,
    schoolName,
    url,
  ].join('\n')
}
