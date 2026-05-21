import { BottomNav } from '@/components/layout/BottomNav'
import { FavoritesProvider } from '@/context/FavoritesProvider'

/** Shell de la app: contenedor centrado tipo celular + barra inferior. */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <FavoritesProvider>
      <div className="relative mx-auto min-h-screen w-full max-w-2xl bg-background shadow-sm">
        <div className="bottom-nav-offset">{children}</div>
        <BottomNav />
      </div>
    </FavoritesProvider>
  )
}
