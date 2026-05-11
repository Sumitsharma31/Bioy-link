// app/dashboard/qrcode/loading.tsx
// Shown instantly on navigation to /dashboard/qrcode
export default function QRCodeLoading() {
  return (
    <div className="space-y-lg animate-pulse p-1 flex flex-col items-center">
      {/* Page title */}
      <div className="h-8 w-40 rounded-lg bg-surface-container-high self-start" />

      {/* QR code placeholder */}
      <div className="w-56 h-56 rounded-2xl bg-surface-container-high" />

      {/* Download buttons */}
      <div className="flex gap-md">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="h-10 w-32 rounded-lg bg-surface-container-high" />
        ))}
      </div>
    </div>
  );
}
