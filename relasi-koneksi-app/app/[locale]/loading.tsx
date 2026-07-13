/**
 * Instant feedback while the next route compiles / loads (esp. first visit in dev).
 */
export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse px-4 py-12" aria-hidden>
      <div className="mb-3 h-9 w-56 rounded-lg bg-mist-dark" />
      <div className="mb-10 h-4 w-80 max-w-full rounded bg-mist-dark/80" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="overflow-hidden rounded-2xl bg-mist-dark/70">
            <div className="aspect-[4/3] bg-mist-dark" />
            <div className="space-y-2 p-4">
              <div className="h-4 w-3/4 rounded bg-mist-dark" />
              <div className="h-3 w-full rounded bg-mist-dark/80" />
              <div className="h-3 w-2/3 rounded bg-mist-dark/80" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
