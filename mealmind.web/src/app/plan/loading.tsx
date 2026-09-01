export default function Loading() {
  return (
    <main className="px-4 py-6">
      <div className="h-8 w-32 bg-stone/40 rounded animate-pulse mb-4" />
      <div className="flex flex-col gap-4">
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className="bg-surface border border-stone rounded-b-lg shadow-sm p-4 pt-5"
          >
            <div className="h-5 w-24 bg-stone/40 rounded animate-pulse mb-3" />
            <div className="flex flex-col gap-2">
              {[...Array(4)].map((_, j) => (
                <div
                  key={j}
                  className="h-3 w-full bg-stone/30 rounded animate-pulse"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
