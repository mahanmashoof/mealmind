export default function Loading() {
  return (
    <main className="min-h-screen px-4 py-6">
      <div className="h-8 w-1/2 bg-stone/40 rounded animate-pulse mb-4" />
      <div className="h-4 w-1/3 bg-stone/30 rounded animate-pulse mb-6" />
      <div className="h-4 w-24 bg-stone/40 rounded animate-pulse mb-2" />
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="h-3 w-full bg-stone/30 rounded animate-pulse mb-2"
        />
      ))}
    </main>
  );
}
