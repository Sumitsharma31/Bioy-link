// app/(marketing)/demo/loading.tsx
export default function DemoLoading() {
  return (
    <div className="min-h-screen pt-24 pb-20 max-w-7xl mx-auto px-md sm:px-lg animate-pulse">
      {/* Header skeleton */}
      <div className="flex flex-col items-center mb-xl gap-sm">
        <div className="h-5 w-32 rounded-full bg-surface-container-high" />
        <div className="h-10 w-72 rounded-lg bg-surface-container-high" />
        <div className="h-4 w-96 rounded-md bg-surface-container-high" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl items-start">
        {/* Controls skeleton */}
        <div className="lg:col-span-4 flex flex-col gap-lg">
          <div className="h-64 rounded-xl bg-surface-container-low border border-outline-variant/10" />
          <div className="h-40 rounded-xl bg-surface-container-low border border-outline-variant/10" />
          <div className="h-28 rounded-xl bg-surface-container-low border border-outline-variant/10" />
        </div>
        {/* Phone skeleton */}
        <div className="lg:col-span-8 flex justify-center">
          <div className="w-80 h-[620px] rounded-[2.5rem] bg-surface-container-low border border-outline-variant/10" />
        </div>
      </div>
    </div>
  );
}
