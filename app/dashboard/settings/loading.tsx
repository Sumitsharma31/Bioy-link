// app/dashboard/settings/loading.tsx
// Shown instantly on navigation to /dashboard/settings
export default function SettingsLoading() {
  return (
    <div className="space-y-lg animate-pulse p-1">
      {/* Page title */}
      <div className="h-8 w-32 rounded-lg bg-surface-container-high" />

      {/* Avatar + name section */}
      <div className="flex items-center gap-md">
        <div className="w-16 h-16 rounded-full bg-surface-container-high" />
        <div className="space-y-xs flex-1">
          <div className="h-5 w-40 rounded-md bg-surface-container-high" />
          <div className="h-4 w-28 rounded-md bg-surface-container-high" />
        </div>
      </div>

      {/* Form fields */}
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-xs">
          <div className="h-4 w-24 rounded-md bg-surface-container-high" />
          <div className="h-10 w-full rounded-lg bg-surface-container-high" />
        </div>
      ))}

      {/* Save button */}
      <div className="h-10 w-28 rounded-lg bg-surface-container-high" />
    </div>
  );
}
