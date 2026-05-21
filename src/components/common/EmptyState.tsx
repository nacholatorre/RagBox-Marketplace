import { FadeIn } from '@/components/ui/motion'

interface Props {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({ icon, title, description, action }: Props) {
  return (
    <FadeIn className="flex flex-col items-center justify-center px-8 py-20 text-center">
      {icon && (
        <div className="mb-4 flex size-16 items-center justify-center rounded-[1.25rem] bg-muted text-muted-foreground">
          {icon}
        </div>
      )}
      <p className="text-[1.05rem] font-semibold tracking-tight">{title}</p>
      {description && (
        <p className="mt-1.5 max-w-[17rem] text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </FadeIn>
  )
}
