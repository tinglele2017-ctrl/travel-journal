export default function DestinationListPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">目的地</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
          <div key={i} className="overflow-hidden rounded-xl">
            <div className="aspect-[3/4] animate-pulse bg-gray-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
