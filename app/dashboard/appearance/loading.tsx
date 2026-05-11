// app/dashboard/appearance/loading.tsx
// Shown instantly on navigation to /dashboard/appearance
export default function AppearanceLoading() {
  return (
    <div className="space-y-lg animate-pulse p-1">
      {/* Page title */}
      <div className="h-8 w-44 rounded-lg bg-surface-container-high" />

      {/* Theme preset grid skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-md">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-surface-container-high" />
        ))}
      </div>

      {/* Button style options */}
      <div className="h-6 w-32 rounded-md bg-surface-container-high" />
      <div className="flex gap-md">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-10 w-24 rounded-lg bg-surface-container-high" />
        ))}
      </div>

      {/* Font picker skeleton */}
      <div className="h-10 w-full rounded-lg bg-surface-container-high" />

      {/* Save button */}
      <div className="h-10 w-28 rounded-lg bg-surface-container-high" />
    </div>
  );
}
