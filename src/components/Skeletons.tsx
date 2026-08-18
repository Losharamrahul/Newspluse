export function NewsCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-sm">
      <div className="aspect-[16/9] w-full bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-4 w-20 rounded bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
        <div className="h-5 w-full rounded bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
        <div className="h-4 w-3/4 rounded bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
        <div className="flex items-center gap-2 pt-1">
          <div className="h-3 w-24 rounded bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function NewsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <NewsCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function FeaturedSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-sm">
      <div className="aspect-[16/9] lg:aspect-[21/9] w-full bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
      <div className="p-6 space-y-4">
        <div className="h-5 w-24 rounded bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
        <div className="h-7 w-3/4 rounded bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
        <div className="h-5 w-full rounded bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
        <div className="h-4 w-1/2 rounded bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
      </div>
    </div>
  );
}
