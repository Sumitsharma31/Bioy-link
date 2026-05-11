// app/dashboard/loading.tsx
// Shown instantly while the dashboard page fetches data — covers all child routes as fallback
export default function DashboardLoading() {
  return (
    <div className="space-y-xl animate-pulse">
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-md pt-sm">
        <div className="space-y-xs">
          <div className="h-8 w-40 rounded-lg bg-surface-container-high" />
          <div className="h-4 w-72 rounded-md bg-surface-container-high" />
        </div>
        <div className="flex gap-md">
          <div className="h-9 w-28 rounded-lg bg-surface-container-high" />
          <div className="h-9 w-28 rounded-lg bg-surface-container-high" />
        </div>
      </div>

      {/* Stats grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-md lg:gap-lg">
        <div className="sm:col-span-2 lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-md">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-surface-container-high" />
          ))}
        </div>
        <div className="sm:col-span-2 lg:col-span-4 h-24 rounded-xl bg-surface-container-high" />
      </div>

      {/* Links list skeleton */}
      <div className="space-y-md">
        <div className="h-6 w-28 rounded-md bg-surface-container-high" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 rounded-xl bg-surface-container-high" />
        ))}
      </div>

      {/* Theme card skeleton */}
      <div className="h-24 rounded-xl bg-surface-container-high" />
    </div>
  );
}
