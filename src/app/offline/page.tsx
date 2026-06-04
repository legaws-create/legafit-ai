export default function OfflinePage() {
  return (
    <div className="flex min-h-[70dvh] flex-col items-center justify-center text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-lime/15 text-lime">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M3 3l18 18M8.5 16.5a5 5 0 0 1 7 0M5 12.5a10 10 0 0 1 4-2.3M19 12.5a10 10 0 0 0-7-2.9" />
        </svg>
      </div>
      <h1 className="font-display text-2xl font-bold text-chalk">Sedang Offline</h1>
      <p className="mt-2 max-w-xs text-sm text-chalk-faint">
        Kamu sedang tidak terhubung ke internet. Data yang tersimpan tetap bisa dilihat — fitur AI akan aktif lagi saat online.
      </p>
    </div>
  );
}
