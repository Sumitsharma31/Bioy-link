// app/[username]/loading.tsx
// Shown instantly while the public profile page fetches data from Supabase.
// Mimics the layout of the actual profile page so there's no layout shift.
export default function ProfileLoading() {
  return (
    <div
      className="min-h-screen flex flex-col items-center py-xl px-md animate-pulse"
      style={{ backgroundColor: '#131313', color: '#ffffff' }}
    >
      <div className="w-full max-w-[480px] flex flex-col items-center">
        {/* Avatar skeleton */}
        <div
          className="w-24 h-24 rounded-full mb-md"
          style={{ backgroundColor: '#1c1c1c', border: '2px solid #2a2a2a' }}
        />

        {/* Username skeleton */}
        <div
          className="h-7 w-36 rounded-lg mb-xs"
          style={{ backgroundColor: '#1c1c1c' }}
        />

        {/* Bio skeleton — two lines */}
        <div className="flex flex-col items-center gap-xs mb-xl w-full">
          <div className="h-4 w-64 rounded-md" style={{ backgroundColor: '#1c1c1c' }} />
          <div className="h-4 w-48 rounded-md" style={{ backgroundColor: '#1c1c1c' }} />
        </div>

        {/* Link card skeletons */}
        <div className="w-full flex flex-col gap-md mb-lg">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="w-full h-14 rounded-lg"
              style={{
                backgroundColor: '#1c1c1c',
                opacity: 1 - i * 0.15,
              }}
            />
          ))}
        </div>

        {/* Social icons row skeleton */}
        <div
          className="w-full flex justify-center gap-md py-md mt-md border-t"
          style={{ borderColor: 'rgba(150,150,150,0.2)' }}
        >
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-10 h-10 rounded-full"
              style={{ backgroundColor: '#1c1c1c' }}
            />
          ))}
        </div>

        {/* Footer skeleton */}
        <div className="mt-auto pt-xl flex flex-col items-center gap-md">
          <div className="h-3 w-28 rounded-md" style={{ backgroundColor: '#1c1c1c' }} />
        </div>
      </div>
    </div>
  );
}
