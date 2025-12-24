import { Skeleton } from '@/components/ui/skeleton';

export function FlightResultsSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Filters skeleton */}
      <div className="lg:col-span-1">
        <div className="bg-card border border-border rounded-lg p-4 space-y-4">
          <Skeleton className="h-6 w-24" />
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
          <Skeleton className="h-6 w-24 mt-4" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      {/* Results skeleton */}
      <div className="lg:col-span-3 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-10 w-40" />
        </div>

        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-4">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="flex-1 space-y-4">
                {/* Outbound */}
                <div className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="flex-1 flex items-center gap-4">
                    <div className="space-y-1">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-4 w-10" />
                    </div>
                    <div className="flex-1 flex flex-col items-center">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-px w-full my-2" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                    <div className="space-y-1">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-4 w-10" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:border-l lg:border-border lg:pl-4 lg:ml-4 flex flex-col items-center lg:items-end gap-2 min-w-[140px]">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
