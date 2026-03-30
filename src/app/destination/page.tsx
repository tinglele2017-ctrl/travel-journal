import { createServerCaller } from "@/lib/server-api";
import { DestinationCard } from "@/components/journal/destination-card";

export const dynamic = "force-dynamic";

export default async function DestinationListPage() {
  const caller = await createServerCaller();
  const destinations = await caller.destination.list({ level: "country" });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold">目的地</h1>
      <p className="mb-8 text-gray-500">探索世界各地的旅行故事</p>

      {destinations.length === 0 ? (
        <div className="py-20 text-center">
          <div className="mb-4 text-5xl">📍</div>
          <p className="text-gray-500">暂无目的地数据</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {destinations.map((dest) => (
            <DestinationCard
              key={dest.id}
              id={dest.id}
              name={dest.name}
              coverImage={dest.coverImage}
              journalCount={dest.journalCount}
            />
          ))}
        </div>
      )}
    </div>
  );
}
