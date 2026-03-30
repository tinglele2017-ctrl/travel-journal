import Link from "next/link";

export const dynamic = "force-dynamic";

interface DestItem {
  id: string; name: string; coverImage: string | null; journalCount: number;
}

const FALLBACK: DestItem[] = [
  { id: "1", name: "日本", coverImage: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&h=500&fit=crop", journalCount: 128 },
  { id: "2", name: "冰岛", coverImage: "https://images.unsplash.com/photo-1520769669658-f07657f5a307?w=400&h=500&fit=crop", journalCount: 45 },
  { id: "3", name: "新西兰", coverImage: "https://images.unsplash.com/photo-1469521669194-babb45599def?w=400&h=500&fit=crop", journalCount: 67 },
  { id: "4", name: "摩洛哥", coverImage: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=400&h=500&fit=crop", journalCount: 34 },
  { id: "5", name: "新西兰", coverImage: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=400&h=500&fit=crop", journalCount: 23 },
];

export default async function DestinationListPage() {
  let destinations = FALLBACK;
  try {
    const { createServerCaller } = await import("@/lib/server-api");
    const caller = await createServerCaller();
    const raw = await caller.destination.list({ level: "country" });
    if (raw.length > 0) destinations = raw as DestItem[];
  } catch {}

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold">目的地</h1>
      <p className="mb-8 text-gray-500">探索世界各地的旅行故事</p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {destinations.map((dest) => (
          <Link key={dest.id} href={`/destination/${dest.id}`} className="group block">
            <div className="relative overflow-hidden rounded-xl">
              <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                {dest.coverImage ? <img src={dest.coverImage} alt={dest.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" /> : <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100"><span className="text-5xl">📍</span></div>}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-lg font-bold text-white">{dest.name}</h3>
                <p className="text-sm text-white/80">{dest.journalCount} 篇游记</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
