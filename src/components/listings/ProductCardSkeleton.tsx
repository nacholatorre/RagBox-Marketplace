export function ProductCardSkeleton() {
  return (
    <div>
      <div className="skeleton aspect-[4/5] rounded-[1.4rem]" />
      <div className="mt-2.5 space-y-1.5 px-0.5">
        <div className="skeleton h-3.5 w-14 rounded-md" />
        <div className="skeleton h-3 w-full rounded-md" />
        <div className="skeleton h-2.5 w-20 rounded-md" />
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}
