import type { Listing } from '@/types'
import { Reveal } from '@/components/ui/motion'
import { ProductCard } from './ProductCard'

export function ProductGrid({
  listings,
  schoolSlug,
}: {
  listings: Listing[]
  schoolSlug: string
}) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3">
      {listings.map((listing, i) => (
        <Reveal key={listing.id} delay={(i % 8) * 0.035}>
          <ProductCard listing={listing} schoolSlug={schoolSlug} />
        </Reveal>
      ))}
    </div>
  )
}
