// app/dashboard/analytics/loading.tsx
// Shown instantly on navigation to /dashboard/analytics
export default function AnalyticsLoading() {
  return (
    <div className="space-y-lg animate-pulse p-1">
      {/* Page title */}
      <div className="h-8 w-36 rounded-lg bg-surface-container-high" />

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-surface-container-high" />
        ))}
      </div>

      {/* Chart placeholder */}
      <div className="h-48 rounded-xl bg-surface-container-high" />

      {/* Links table */}
      <div className="space-y-md">
        <div className="h-6 w-28 rounded-md bg-surface-container-high" />
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-12 rounded-xl bg-surface-container-high" />
        ))}
      </div>
    </div>
  );
}
