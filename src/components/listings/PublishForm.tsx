'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ImagePlus, Loader2, MessageSquare, Tag, UserCog, X } from 'lucide-react'
import { toast } from 'sonner'
import type { Category, Condition, School } from '@/types'
import {
  CATEGORIES,
  CONDITIONS,
  MAX_IMAGES,
  MAX_IMAGE_SIZE_MB,
  SIZES,
  SIZED_CATEGORIES,
} from '@/lib/constants'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

type Mode = 'sell' | 'message'
type MessageType = 'busco' | 'dono' | 'aviso'

const MESSAGE_TYPES: { key: MessageType; label: string; placeholder: string }[] = [
  {
    key: 'busco',
    label: 'Busco',
    placeholder: 'Ej: Busco chomba talle 10',
  },
  {
    key: 'dono',
    label: 'Dono',
    placeholder: 'Ej: Dono útiles escolares varios',
  },
  {
    key: 'aviso',
    label: 'Aviso',
    placeholder: 'Ej: Encontré una campera en la salida',
  },
]

const MESSAGE_TYPE_TO_DB: Record<MessageType, 'request' | 'donation' | 'announcement'> = {
  busco: 'request',
  dono: 'donation',
  aviso: 'announcement',
}

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const ALLOWED_IMAGE_ACCEPT = ALLOWED_IMAGE_TYPES.join(',')

export function PublishForm({
  school,
  initialMode = 'sell',
}: {
  school: School
  initialMode?: Mode
}) {
  const router = useRouter()
  const { user, profile, profileComplete, supabase } = useAuth()
  const fileRef = useRef<HTMLInputElement>(null)

  const [mode, setMode] = useState<Mode>(initialMode)
  const [messageType, setMessageType] = useState<MessageType>('busco')
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([])
  const [category, setCategory] = useState<Category | ''>('')
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [description, setDescription] = useState('')
  const [size, setSize] = useState('')
  const [condition, setCondition] = useState<Condition | ''>('')
  const [hasPrice, setHasPrice] = useState(true)
  const [price, setPrice] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)

  const isMessage = mode === 'message'
  const showSize = !!category && SIZED_CATEGORIES.includes(category)

  if (!profileComplete) {
    return (
      <div className="px-5 py-16 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-[1.25rem] bg-muted text-muted-foreground">
          <UserCog className="size-7" strokeWidth={1.6} />
        </div>
        <h2 className="mt-4 text-[1.05rem] font-semibold tracking-tight">
          Completá tu perfil
        </h2>
        <p className="mx-auto mt-1.5 max-w-[17rem] text-sm leading-relaxed text-muted-foreground">
          Necesitamos tu nombre y tu WhatsApp para que las familias te puedan
          contactar.
        </p>
        <Link
          href="/perfil"
          className="mt-6 inline-flex h-12 items-center rounded-full bg-primary px-6 text-[0.95rem] font-semibold text-primary-foreground transition-transform active:scale-[0.97]"
        >
          Ir a mi perfil
        </Link>
      </div>
    )
  }

  function addImages(files: FileList | null) {
    if (!files) return
    const slots = MAX_IMAGES - previews.length
    const picked = Array.from(files).slice(0, slots)
    const badType = picked.find(f => !ALLOWED_IMAGE_TYPES.includes(f.type))
    if (badType) {
      toast.error('Solo se aceptan fotos JPG, PNG o WEBP')
      return
    }
    const tooBig = picked.find(f => f.size > MAX_IMAGE_SIZE_MB * 1024 * 1024)
    if (tooBig) {
      toast.error(`Cada foto debe pesar menos de ${MAX_IMAGE_SIZE_MB}MB`)
      return
    }
    setPreviews(prev => [
      ...prev,
      ...picked.map(file => ({ file, url: URL.createObjectURL(file) })),
    ])
  }

  function removeImage(i: number) {
    setPreviews(prev => {
      URL.revokeObjectURL(prev[i].url)
      return prev.filter((_, idx) => idx !== i)
    })
  }

  async function uploadImages(folder: string): Promise<string[]> {
    const urls: string[] = []
    for (let i = 0; i < previews.length; i++) {
      const { file } = previews[i]
      const ext = file.name.split('.').pop() ?? 'jpg'
      const path = `${folder}/${i}-${Date.now()}.${ext}`
      const { error } = await supabase.storage
        .from('listing-images')
        .upload(path, file)
      if (error) throw error
      urls.push(
        supabase.storage.from('listing-images').getPublicUrl(path).data.publicUrl,
      )
    }
    return urls
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user || !profile) return

    if (isMessage) {
      if (!message.trim()) return toast.error('Escribí tu mensaje')
    } else {
      if (!category) return toast.error('Elegí una categoría')
      if (!title.trim()) return toast.error('Poné un título')
      if (!condition) return toast.error('Elegí la condición')
    }
    if (!agreed) return toast.error('Tenés que aceptar los términos')

    setLoading(true)
    try {
      // Carpeta única para las imágenes. Evitamos crypto.randomUUID porque
      // requiere contexto seguro (HTTPS o localhost) y rompe sobre HTTP de LAN.
      const folder = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
      const images = previews.length ? await uploadImages(folder) : []

      if (isMessage) {
        const { error } = await supabase.from('listings').insert({
          school_id: school.id,
          seller_id: user.id,
          type: MESSAGE_TYPE_TO_DB[messageType],
          title: message.trim(),
          price: null,
          price_mode: 'free',
          category: 'otros',
          condition: 'usado',
          seller_name: profile.full_name,
          seller_whatsapp: profile.whatsapp,
          images,
          status: 'active',
        })
        if (error) throw error
        toast.success('¡Mensaje publicado!')
        router.push(`/${school.slug}/tablon`)
        return
      }

      const { data, error } = await supabase
        .from('listings')
        .insert({
          school_id: school.id,
          seller_id: user.id,
          type: 'sell',
          title: title.trim(),
          description: description.trim() || null,
          price: hasPrice && price ? Number(price) : null,
          price_mode: hasPrice && price ? 'fixed' : 'negotiable',
          category,
          condition,
          size: showSize && size ? size : null,
          seller_name: profile.full_name,
          seller_whatsapp: profile.whatsapp,
          images,
          status: 'active',
        })
        .select('id')
        .single()

      if (error || !data) throw error ?? new Error('insert')

      toast.success('¡Aviso publicado!')
      router.push(`/${school.slug}/${data.id}`)
    } catch (err) {
      const msg =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: unknown }).message)
          : 'desconocido'
      console.error('[publish] error:', err)
      toast.error(`No se pudo publicar: ${msg}`)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 px-5 pb-10 pt-2">
      {/* Qué quiero publicar */}
      <Group label="¿Qué querés publicar?">
        <div className="flex flex-wrap gap-2">
          <Chip active={mode === 'sell'} onClick={() => setMode('sell')}>
            <Tag className="size-4" strokeWidth={2} />
            Vendo un producto
          </Chip>
          <Chip active={mode === 'message'} onClick={() => setMode('message')}>
            <MessageSquare className="size-4" strokeWidth={2} />
            Mensaje al Tablón
          </Chip>
        </div>
      </Group>

      {isMessage ? (
        <>
          {/* Tipo de mensaje */}
          <Group label="Tipo">
            <div className="flex flex-wrap gap-2">
              {MESSAGE_TYPES.map(t => (
                <Chip
                  key={t.key}
                  active={messageType === t.key}
                  onClick={() => setMessageType(t.key)}
                >
                  {t.label}
                </Chip>
              ))}
            </div>
          </Group>

          {/* Mensaje */}
          <Group label="Tu mensaje">
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              maxLength={280}
              rows={5}
              autoFocus
              placeholder={
                MESSAGE_TYPES.find(t => t.key === messageType)?.placeholder ?? ''
              }
              className="w-full resize-none rounded-2xl bg-muted p-4 text-[0.95rem] leading-relaxed outline-none transition-shadow focus:ring-2 focus:ring-foreground/10"
            />
            <p className="text-right text-[0.72rem] text-muted-foreground">
              {message.length}/280
            </p>
          </Group>

          {/* Foto opcional */}
          <Group label="Foto" hint="Opcional — se ve al abrir el mensaje">
            <ImagePicker
              previews={previews}
              onAdd={() => fileRef.current?.click()}
              onRemove={removeImage}
              showCover={false}
            />
          </Group>
        </>
      ) : (
        <>
          {/* Fotos */}
          <Group
            label="Fotos"
            hint={`Hasta ${MAX_IMAGES}. La primera es la portada.`}
          >
            <ImagePicker
              previews={previews}
              onAdd={() => fileRef.current?.click()}
              onRemove={removeImage}
              showCover
            />
          </Group>

          {/* Categoría */}
          <Group label="Categoría">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(c => (
                <Chip
                  key={c.slug}
                  active={category === c.slug}
                  onClick={() => setCategory(c.slug)}
                >
                  <c.Icon className="size-4" strokeWidth={2} />
                  {c.label}
                </Chip>
              ))}
            </div>
          </Group>

          {/* Título */}
          <Group label="Título">
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              maxLength={80}
              placeholder="Ej: Chomba talle 10, muy buen estado"
              className="h-12 w-full rounded-2xl bg-muted px-4 text-[0.95rem] outline-none transition-shadow focus:ring-2 focus:ring-foreground/10"
            />
          </Group>

          {/* Descripción */}
          <Group label="Descripción" hint="Opcional">
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              maxLength={500}
              rows={4}
              placeholder="Detalles: color, desgaste, medidas, por qué lo vendés…"
              className="w-full resize-none rounded-2xl bg-muted p-4 text-[0.95rem] outline-none transition-shadow focus:ring-2 focus:ring-foreground/10"
            />
          </Group>

          {/* Talle */}
          {showSize && (
            <Group label="Talle" hint="Opcional">
              <div className="flex flex-wrap gap-2">
                {SIZES.map(s => (
                  <Chip
                    key={s}
                    active={size === s}
                    onClick={() => setSize(size === s ? '' : s)}
                  >
                    {s}
                  </Chip>
                ))}
              </div>
            </Group>
          )}

          {/* Condición */}
          <Group label="Condición">
            <div className="flex flex-wrap gap-2">
              {CONDITIONS.map(c => (
                <Chip
                  key={c.slug}
                  active={condition === c.slug}
                  onClick={() => setCondition(c.slug)}
                >
                  {c.label}
                </Chip>
              ))}
            </div>
          </Group>

          {/* Precio */}
          <Group label="Precio">
            <div className="flex flex-wrap items-center gap-2.5">
              <Chip active={!hasPrice} onClick={() => setHasPrice(v => !v)}>
                A convenir
              </Chip>
              {hasPrice && (
                <div className="flex h-12 flex-1 items-center rounded-2xl bg-muted px-4 transition-shadow focus-within:ring-2 focus-within:ring-foreground/10">
                  <span className="text-[0.95rem] text-muted-foreground">$</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    step={100}
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    placeholder="15000"
                    className="ml-1.5 w-full bg-transparent text-[0.95rem] outline-none"
                  />
                </div>
              )}
            </div>
          </Group>
        </>
      )}

      <input
        ref={fileRef}
        type="file"
        accept={ALLOWED_IMAGE_ACCEPT}
        multiple
        hidden
        onChange={e => addImages(e.target.files)}
      />

      {/* Términos */}
      <label className="flex items-start gap-3 rounded-2xl bg-muted/50 p-4">
        <input
          type="checkbox"
          checked={agreed}
          onChange={e => setAgreed(e.target.checked)}
          className="mt-0.5 size-[1.05rem] shrink-0 accent-primary"
        />
        <span className="text-[0.8rem] leading-relaxed text-muted-foreground">
          La publicación se muestra sin moderación previa. Soy responsable de la
          información que cargo y del trato con la otra familia.
        </span>
      </label>

      <button
        type="submit"
        disabled={loading}
        className="flex h-14 w-full items-center justify-center rounded-full bg-primary text-[0.95rem] font-semibold text-primary-foreground transition-transform active:scale-[0.98] disabled:opacity-60"
      >
        {loading ? (
          <Loader2 className="size-5 animate-spin" />
        ) : isMessage ? (
          'Publicar mensaje'
        ) : (
          'Publicar aviso'
        )}
      </button>
    </form>
  )
}

function ImagePicker({
  previews,
  onAdd,
  onRemove,
  showCover,
}: {
  previews: { file: File; url: string }[]
  onAdd: () => void
  onRemove: (i: number) => void
  showCover: boolean
}) {
  return (
    <div className="grid grid-cols-3 gap-2.5">
      {previews.map((p, i) => (
        <div
          key={i}
          className="relative aspect-square overflow-hidden rounded-[1.1rem] bg-muted"
        >
          <Image src={p.url} alt="" fill className="object-cover" sizes="120px" />
          {showCover && i === 0 && (
            <span className="absolute bottom-1.5 left-1.5 rounded-md bg-foreground/80 px-1.5 py-0.5 text-[0.6rem] font-semibold text-background">
              Portada
            </span>
          )}
          <button
            type="button"
            onClick={() => onRemove(i)}
            aria-label="Quitar"
            className="absolute right-1.5 top-1.5 flex size-6 items-center justify-center rounded-full bg-foreground/75 text-background backdrop-blur"
          >
            <X className="size-3.5" />
          </button>
        </div>
      ))}
      {previews.length < MAX_IMAGES && (
        <button
          type="button"
          onClick={onAdd}
          className="flex aspect-square flex-col items-center justify-center gap-1 rounded-[1.1rem] border border-dashed border-border bg-muted/40 text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
        >
          <ImagePlus className="size-6" strokeWidth={1.7} />
          <span className="text-[0.7rem] font-medium">Agregar</span>
        </button>
      )}
    </div>
  )
}

function Group({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <p className="text-[0.95rem] font-semibold tracking-tight">{label}</p>
        {hint && <p className="text-[0.75rem] text-muted-foreground">{hint}</p>}
      </div>
      {children}
    </div>
  )
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-[0.9rem] font-medium transition-colors',
        active
          ? 'bg-foreground text-background'
          : 'bg-muted text-muted-foreground hover:text-foreground',
      )}
    >
      {children}
    </button>
  )
}
