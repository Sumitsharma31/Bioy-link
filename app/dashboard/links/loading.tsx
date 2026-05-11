// app/dashboard/links/loading.tsx
// Shown instantly on navigation to /dashboard/links while the server fetches data
export default function LinksLoading() {
  return (
    <div className="space-y-md animate-pulse p-1">
      {/* Page title skeleton */}
      <div className="h-8 w-36 rounded-lg bg-surface-container-high" />
      <div className="h-4 w-56 rounded-md bg-surface-container-high" />

      {/* Add link button skeleton */}
      <div className="h-10 w-32 rounded-lg bg-surface-container-high mt-md" />

      {/* Link card skeletons */}
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-16 rounded-xl bg-surface-container-high" />
      ))}
    </div>
  );
}
