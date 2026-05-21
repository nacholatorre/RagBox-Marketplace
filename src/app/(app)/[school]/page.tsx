import { Suspense } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PackageOpen, Plus } from 'lucide-react'
import type { Category, Condition, SortKey } from '@/types'
import { getSchoolBySlug, getListings } from '@/lib/queries'
import { AppHeader } from '@/components/layout/AppHeader'
import { SearchBar } from '@/components/listings/SearchBar'
import { CategoryPills } from '@/components/listings/CategoryPills'
import { SortMenu } from '@/components/listings/SortMenu'
import { FilterSheet } from '@/components/listings/FilterSheet'
import { ProductGrid } from '@/components/listings/ProductGrid'
import { SellPrompt } from '@/components/listings/SellPrompt'
import { EmptyState } from '@/components/common/EmptyState'

interface Props {
  params: Promise<{ school: string }>
  searchParams: Promise<Record<string, string | undefined>>
}

export default async function SchoolBoardPage({ params, searchParams }: Props) {
  const { school: slug } = await params
  const sp = await searchParams

  const school = await getSchoolBySlug(slug)
  if (!school) notFound()

  const listings = await getListings(school.id, {
    category: sp.cat as Category | undefined,
    query: sp.q,
    sort: sp.sort as SortKey | undefined,
    size: sp.size,
    condition: sp.condition as Condition | undefined,
    minPrice: sp.min ? Number(sp.min) : undefined,
    maxPrice: sp.max ? Number(sp.max) : undefined,
  })

  const hasFilters = !!(sp.cat || sp.q || sp.size || sp.condition || sp.min || sp.max)

  return (
    <div>
      <AppHeader
        title={school.name}
        subtitle={`${listings.length} ${listings.length === 1 ? 'aviso publicado por familias' : 'avisos publicados por familias'}`}
        logoUrl={school.logo_url ?? undefined}
      />

      <div className="space-y-3.5 px-5 pb-4 pt-1.5">
        <Suspense>
          <SearchBar />
        </Suspense>
        <Suspense>
          <CategoryPills />
        </Suspense>
        <div className="flex items-center gap-2">
          <Suspense>
            <SortMenu />
          </Suspense>
          <Suspense>
            <FilterSheet />
          </Suspense>
        </div>
      </div>

      <div className="px-5 pb-10">
        {listings.length > 0 && (
          <div className="mb-4">
            <SellPrompt publishHref={`/${school.slug}/publicar`} />
          </div>
        )}
        {listings.length === 0 ? (
          <EmptyState
            icon={<PackageOpen className="size-7" strokeWidth={1.6} />}
            title={hasFilters ? 'Nada por acá' : 'Todavía no hay avisos'}
            description={
              hasFilters
                ? 'Probá ajustar la búsqueda o quitar algún filtro.'
                : `Sé la primera familia en publicar algo en ${school.name}.`
            }
            action={
              !hasFilters && (
                <Link
                  href={`/${school.slug}/publicar`}
                  className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-[0.95rem] font-semibold text-primary-foreground transition-transform active:scale-[0.97]"
                >
                  <Plus className="size-4" />
                  Publicar un aviso
                </Link>
              )
            }
          />
        ) : (
          <ProductGrid listings={listings} schoolSlug={school.slug} />
        )}
      </div>
    </div>
  )
}
