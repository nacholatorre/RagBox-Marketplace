import { Camera, Check, MapPin } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { Listing } from '@/types'
import { buildQuickQuestionUrl, type QuickQuestion } from '@/lib/whatsapp'

interface Props {
  listing: Listing
  schoolName: string
}

interface Question {
  key: QuickQuestion
  icon: LucideIcon
  label: string
}

const QUESTIONS: Question[] = [
  { key: 'available', icon: Check, label: '¿Sigue disponible?' },
  { key: 'more-photos', icon: Camera, label: '¿Me pasás más fotos?' },
  { key: 'pickup', icon: MapPin, label: '¿Se puede retirar por el colegio?' },
]

/** 3 botones que abren WhatsApp con un cierre distinto pre-armado. */
export function QuickWhatsAppQuestions({ listing, schoolName }: Props) {
  return (
    <section>
      <h2 className="text-[0.95rem] font-semibold tracking-tight">
        Preguntas rápidas
      </h2>
      <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {QUESTIONS.map(({ key, icon: Icon, label }) => (
          <a
            key={key}
            href={buildQuickQuestionUrl(listing, schoolName, key)}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 rounded-2xl border border-border/70 bg-background px-4 py-3.5 text-left text-[0.88rem] font-semibold text-foreground transition-all duration-200 hover:border-primary/40 hover:bg-primary/[0.04] active:scale-[0.98]"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
              <Icon className="size-[1.05rem]" strokeWidth={2} />
            </span>
            <span className="leading-snug">{label}</span>
          </a>
        ))}
      </div>
      <p className="mt-2.5 text-[0.72rem] text-muted-foreground">
        Se abrirá WhatsApp con un mensaje prearmado.
      </p>
    </section>
  )
}
