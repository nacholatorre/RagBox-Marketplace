export default function ListingLoading() {
  return (
    <div>
      <div className="skeleton aspect-[4/5] w-full" />
      <div className="relative -mt-7 space-y-4 rounded-t-[1.75rem] bg-background px-5 pt-6">
        <div className="skeleton h-5 w-3/4 rounded-md" />
        <div className="skeleton h-8 w-32 rounded-md" />
        <div className="flex gap-2">
          <div className="skeleton h-8 w-20 rounded-full" />
          <div className="skeleton h-8 w-24 rounded-full" />
        </div>
        <div className="skeleton h-24 rounded-2xl" />
        <div className="skeleton h-20 rounded-2xl" />
      </div>
    </div>
  )
}
