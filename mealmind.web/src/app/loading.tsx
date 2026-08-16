export default function Loading() {
  return (
    <main className="min-h-screen px-4 py-6">
      <div className="h-8 w-40 bg-stone/40 rounded animate-pulse mb-4" />
      <ul className="flex flex-col gap-3">
        {[...Array(4)].map((_, i) => (
          <li
            key={i}
            className="bg-white border border-stone rounded-b-lg shadow-sm p-4 pt-5"
          >
            <div className="h-4 w-2/3 bg-stone/40 rounded animate-pulse mb-2" />
            <div className="h-3 w-1/3 bg-stone/30 rounded animate-pulse" />
          </li>
        ))}
      </ul>
    </main>
  );
}
