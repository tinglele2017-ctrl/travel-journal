import Link from "next/link";

export const dynamic = "force-dynamic";

interface JournalItem {
  id: string; title: string; coverImage: string | null; summary: string | null;
  author: { id: string; username: string; avatar: string | null };
  totalDays: number; likeCount: number; collectCount: number;
}

const FALLBACK: JournalItem[] = [
  { id: "1", title: "冰岛环岛自驾 14 天完整攻略", coverImage: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=600&h=450&fit=crop", summary: "从雷克雅未克出发，逆时针环岛...", author: { id: "1", username: "小明", avatar: null }, totalDays: 14, likeCount: 128, collectCount: 64 },
  { id: "2", title: "迷失京都：寺庙与抹茶之旅", coverImage: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&h=450&fit=crop", summary: "5天深度游京都...", author: { id: "2", username: "旅人甲", avatar: null }, totalDays: 5, likeCount: 96, collectCount: 48 },
  { id: "3", title: "新西兰南岛自驾：中土世界现实版", coverImage: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=600&h=450&fit=crop", summary: "10天南岛自驾路线...", author: { id: "3", username: "花花", avatar: null }, totalDays: 10, likeCount: 203, collectCount: 98 },
];

export default async function ExplorePage() {
  let journals = FALLBACK;
  try {
    const { createServerCaller } = await import("@/lib/server-api");
    const caller = await createServerCaller();
    const { items } = await caller.journal.list({ limit: 12, sortBy: "latest" });
    if (items.length > 0) journals = items as JournalItem[];
  } catch {}

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold">发现精彩游记</h1>
      <p className="mb-8 text-gray-500">探索旅行者们的旅途故事</p>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {journals.map((j) => (
          <Link key={j.id} href={`/journal/${j.id}`} className="group block">
            <div className="overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-md">
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                {j.coverImage ? <img src={j.coverImage} alt={j.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" /> : <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100"><span className="text-4xl">🌍</span></div>}
              </div>
              <div className="p-4">
                <h3 className="mb-1 line-clamp-2 text-lg font-semibold text-gray-900 group-hover:text-primary">{j.title}</h3>
                {j.summary && <p className="mb-3 line-clamp-2 text-sm text-gray-500">{j.summary}</p>}
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-600">{j.author.username[0]}</div>
                  <span className="text-sm text-gray-600">{j.author.username}</span>
                  {j.totalDays > 0 && <span className="text-sm text-gray-400">· {j.totalDays}天</span>}
                </div>
                <div className="mt-3 flex items-center gap-4 text-sm text-gray-400"><span>❤ {j.likeCount}</span><span>⭐ {j.collectCount}</span></div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
