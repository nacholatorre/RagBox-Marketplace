import { ProductGridSkeleton } from '@/components/listings/ProductCardSkeleton'

export default function BoardLoading() {
  return (
    <div>
      <div className="h-14" />
      <div className="space-y-3.5 px-5 pb-4 pt-1.5">
        <div className="skeleton h-12 w-full rounded-full" />
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton h-9 w-20 shrink-0 rounded-full" />
          ))}
        </div>
      </div>
      <div className="px-5 pb-10">
        <ProductGridSkeleton count={6} />
      </div>
    </div>
  )
}
