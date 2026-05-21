'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { Camera, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'

interface Props {
  /** URL actual de la foto (o null). */
  value: string | null
  /** Se llama con la URL nueva después de subir. */
  onChange: (url: string) => void
  /** Inicial a mostrar cuando no hay foto. */
  fallbackText?: string
  /** Diámetro en px. */
  size?: number
}

const MAX_MB = 5

/** Avatar circular con botón de cámara para subir foto a Storage. */
export function AvatarUploader({ value, onChange, fallbackText = '?', size = 96 }: Props) {
  const { user, supabase } = useAuth()
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  async function handleFile(files: FileList | null) {
    const file = files?.[0]
    if (!file || !user) return
    if (file.size > MAX_MB * 1024 * 1024) {
      toast.error(`La foto debe pesar menos de ${MAX_MB}MB`)
      return
    }
    setUploading(true)
    try {
      const ext = file.name.split('.').pop() ?? 'jpg'
      const path = `${user.id}/${Date.now()}.${ext}`
      const { error } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true })
      if (error) throw error
      const url = supabase.storage.from('avatars').getPublicUrl(path).data.publicUrl
      onChange(url)
    } catch {
      toast.error('No se pudo subir la foto')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        aria-label="Cambiar foto de perfil"
        className="relative size-full overflow-hidden rounded-full bg-foreground text-background transition-transform active:scale-95"
      >
        {value ? (
          <Image src={value} alt="" fill className="object-cover" sizes="96px" />
        ) : (
          <span
            className="flex size-full items-center justify-center font-semibold"
            style={{ fontSize: size * 0.36 }}
          >
            {fallbackText.charAt(0).toUpperCase()}
          </span>
        )}
        {uploading && (
          <span className="absolute inset-0 flex items-center justify-center bg-foreground/60">
            <Loader2 className="size-5 animate-spin text-background" />
          </span>
        )}
      </button>
      <span className="pointer-events-none absolute -bottom-0.5 -right-0.5 flex size-8 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground">
        <Camera className="size-4" />
      </span>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={e => handleFile(e.target.files)}
      />
    </div>
  )
}
