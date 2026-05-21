import { Suspense } from 'react'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { LoginForm } from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col bg-background">
      <header className="flex h-14 items-center px-3">
        <Link
          href="/"
          aria-label="Volver"
          className="-ml-1 flex size-9 items-center justify-center rounded-full hover:bg-muted"
        >
          <ChevronLeft className="size-5" />
        </Link>
      </header>
      <div className="flex flex-1 flex-col justify-center px-6 pb-20">
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  )
}
