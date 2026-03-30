import { createServerCaller } from "@/lib/server-api";
import { JournalCard } from "@/components/journal/journal-card";
import { DestinationCard } from "@/components/journal/destination-card";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface JournalItem {
  id: string; title: string; coverImage: string | null; summary: string | null;
  author: { id: string; username: string; avatar: string | null };
  totalDays: number; likeCount: number; collectCount: number;
}

interface DestItem {
  id: string; name: string; coverImage: string | null; journalCount: number;
}

// 示例数据（数据库不可用时降级展示）
const FALLBACK_JOURNALS: JournalItem[] = [
  { id: "1", title: "冰岛环岛自驾 14 天完整攻略", coverImage: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=600&h=450&fit=crop", summary: "从雷克雅未克出发，逆时针环岛...", author: { id: "1", username: "小明", avatar: null }, totalDays: 14, likeCount: 128, collectCount: 64 },
  { id: "2", title: "迷失京都：寺庙与抹茶之旅", coverImage: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&h=450&fit=crop", summary: "5天深度游京都...", author: { id: "2", username: "旅人甲", avatar: null }, totalDays: 5, likeCount: 96, collectCount: 48 },
  { id: "3", title: "新西兰南岛自驾：中土世界现实版", coverImage: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=600&h=450&fit=crop", summary: "10天南岛自驾路线...", author: { id: "3", username: "花花", avatar: null }, totalDays: 10, likeCount: 203, collectCount: 98 },
];

const FALLBACK_DESTS: DestItem[] = [
  { id: "1", name: "日本", coverImage: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&h=500&fit=crop", journalCount: 128 },
  { id: "2", name: "冰岛", coverImage: "https://images.unsplash.com/photo-1520769669658-f07657f5a307?w=400&h=500&fit=crop", journalCount: 45 },
  { id: "3", name: "新西兰", coverImage: "https://images.unsplash.com/photo-1469521669194-babb45599def?w=400&h=500&fit=crop", journalCount: 67 },
  { id: "4", name: "摩洛哥", coverImage: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=400&h=500&fit=crop", journalCount: 34 },
  { id: "5", name: "冰岛", coverImage: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=400&h=500&fit=crop", journalCount: 23 },
];

export default async function Home() {
  let journals: JournalItem[] = FALLBACK_JOURNALS;
  let destinations: DestItem[] = FALLBACK_DESTS;
  let useFallback = true;

  try {
    const caller = await createServerCaller();
    const [journalsResult, hotDests] = await Promise.all([
      caller.journal.list({ limit: 6, sortBy: "popular" }),
      caller.destination.hot({ limit: 5 }),
    ]);
    journals = journalsResult.items as JournalItem[];
    destinations = hotDests as DestItem[];
    useFallback = false;
  } catch {
    // 数据库不可用，使用示例数据
  }

  return (
    <div>
      {/* 数据库状态提示 */}
      {useFallback && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 text-center text-sm text-amber-800">
          ⚠️ 数据库未连接，当前展示示例数据。配置 DATABASE_URL 后即可正常使用。
        </div>
      )}

      {/* Hero Banner */}
      <section className="relative h-[520px] overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-800">
        <div className="absolute inset-0">
          {journals[0]?.coverImage && (
            <img src={journals[0].coverImage} alt={journals[0].title} className="h-full w-full object-cover opacity-40" />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="mx-auto max-w-6xl">
            {journals.length > 0 && (
              <>
                <span className="mb-2 inline-block rounded-full bg-white/20 px-3 py-1 text-sm text-white backdrop-blur-sm">✨ 编辑精选</span>
                <h1 className="mb-2 text-4xl font-bold text-white drop-shadow-lg">{journals[0].title}</h1>
                <p className="text-lg text-white/80">by {journals[0].author.username}</p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 热门目的地 */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">🔥 热门目的地</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {destinations.map((dest) => (
            <DestinationCard key={dest.id} id={dest.id} name={dest.name} coverImage={dest.coverImage} journalCount={dest.journalCount} />
          ))}
          <Link href="/destination" className="flex aspect-[3/4] items-center justify-center rounded-xl border-2 border-dashed border-gray-200 text-gray-400 transition-colors hover:border-primary hover:text-primary">
            <span className="text-center"><span className="block text-2xl">→</span><span className="text-sm font-medium">探索更多</span></span>
          </Link>
        </div>
      </section>

      {/* 精选游记 */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">📖 精选游记</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {journals.map((j) => (
            <JournalCard key={j.id} id={j.id} title={j.title} coverImage={j.coverImage} summary={j.summary} author={j.author} totalDays={j.totalDays} likeCount={j.likeCount} collectCount={j.collectCount} />
          ))}
        </div>
      </section>

      {/* 统计条 */}
      <section className="border-t bg-gray-50 py-12">
        <div className="mx-auto grid max-w-6xl grid-cols-3 gap-8 px-4 text-center">
          <div><div className="text-4xl font-bold text-primary">{useFallback ? "100+" : `${journals.length}+`}</div><div className="mt-1 text-sm text-gray-500">篇游记</div></div>
          <div><div className="text-4xl font-bold text-primary">3</div><div className="mt-1 text-sm text-gray-500">位旅行者</div></div>
          <div><div className="text-4xl font-bold text-primary">{destinations.length}</div><div className="mt-1 text-sm text-gray-500">个目的地</div></div>
        </div>
      </section>
    </div>
  );
}
