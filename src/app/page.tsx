import Link from "next/link";
import { JournalCard } from "@/components/journal/journal-card";
import { DestinationCard } from "@/components/journal/destination-card";

// 静态示例数据（Phase 2 骨架，后续接入 tRPC）
const HERO_ITEMS = [
  {
    id: "1",
    title: "穿越冰与火之歌：冰岛环岛 14 天自驾",
    coverImage: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=1200&h=600&fit=crop",
    author: { username: "小明", avatar: null },
  },
  {
    id: "2",
    title: "迷失京都：一场关于寺庙与抹茶的旅程",
    coverImage: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&h=600&fit=crop",
    author: { username: "旅人甲", avatar: null },
  },
  {
    id: "3",
    title: "新西兰南岛：中土世界现实版",
    coverImage: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=1200&h=600&fit=crop",
    author: { username: "花花", avatar: null },
  },
];

const HOT_DESTINATIONS = [
  { id: "d1", name: "日本", coverImage: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&h=500&fit=crop", journalCount: 128 },
  { id: "d2", name: "冰岛", coverImage: "https://images.unsplash.com/photo-1520769669658-f07657f5a307?w=400&h=500&fit=crop", journalCount: 45 },
  { id: "d3", name: "新西兰", coverImage: "https://images.unsplash.com/photo-1469521669194-babb45599def?w=400&h=500&fit=crop", journalCount: 67 },
  { id: "d4", name: "摩洛哥", coverImage: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=400&h=500&fit=crop", journalCount: 34 },
  { id: "d5", name: "更多", coverImage: null, journalCount: 0 },
];

const FEATURED_JOURNALS = [
  {
    id: "j1", title: "冰岛环岛自驾 14 天完整攻略",
    coverImage: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=600&h=450&fit=crop",
    summary: "从雷克雅未克出发，逆时针环岛，途经黄金圈、南岸、东部峡湾...",
    author: { username: "小明", avatar: null }, totalDays: 14, likeCount: 128, collectCount: 64,
  },
  {
    id: "j2", title: "迷失京都：寺庙与抹茶之旅",
    coverImage: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&h=450&fit=crop",
    summary: "5天深度游京都，从伏见稻荷到岚山竹林，体验最地道的日本文化...",
    author: { username: "旅人甲", avatar: null }, totalDays: 5, likeCount: 96, collectCount: 48,
  },
  {
    id: "j3", title: "新西兰南岛自驾：中土世界现实版",
    coverImage: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=600&h=450&fit=crop",
    summary: "10天南岛自驾路线，从基督城到皇后镇，穿越雪山、冰川、湖泊...",
    author: { username: "花花", avatar: null }, totalDays: 10, likeCount: 203, collectCount: 98,
  },
  {
    id: "j4", title: "摩洛哥：撒哈拉沙漠与蓝色小镇",
    coverImage: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=600&h=450&fit=crop",
    summary: "从卡萨布兰卡到马拉喀什，骑骆驼穿越撒哈拉，住沙漠帐篷看星空...",
    author: { username: "沙漠旅人", avatar: null }, totalDays: 8, likeCount: 76, collectCount: 41,
  },
];

export default function Home() {
  return (
    <div>
      {/* ========== Hero Banner ========== */}
      <section className="relative h-[520px] overflow-hidden">
        <div className="flex h-full">
          {HERO_ITEMS.map((item) => (
            <div key={item.id} className="relative flex-1">
              <img
                src={item.coverImage}
                alt={item.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            </div>
          ))}
        </div>
        {/* 覆盖文字 */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="mx-auto max-w-6xl">
            <span className="mb-2 inline-block rounded-full bg-white/20 px-3 py-1 text-sm text-white backdrop-blur-sm">
              ✨ 编辑精选
            </span>
            <h1 className="mb-2 text-4xl font-bold text-white drop-shadow-lg">
              {HERO_ITEMS[0].title}
            </h1>
            <p className="text-lg text-white/80">
              by {HERO_ITEMS[0].author.username}
            </p>
          </div>
        </div>
      </section>

      {/* ========== 热门目的地 ========== */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">
          🔥 热门目的地
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {HOT_DESTINATIONS.map((dest) =>
            dest.name === "更多" ? (
              <Link
                key={dest.id}
                href="/destination"
                className="flex aspect-[3/4] items-center justify-center rounded-xl border-2 border-dashed border-gray-200 text-gray-400 transition-colors hover:border-primary hover:text-primary"
              >
                <span className="text-center">
                  <span className="block text-2xl">→</span>
                  <span className="text-sm font-medium">探索更多</span>
                </span>
              </Link>
            ) : (
              <DestinationCard
                key={dest.id}
                id={dest.id}
                name={dest.name}
                coverImage={dest.coverImage}
                journalCount={dest.journalCount}
              />
            )
          )}
        </div>
      </section>

      {/* ========== 精选游记 ========== */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">
          📖 精选游记
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {FEATURED_JOURNALS.map((journal) => (
            <JournalCard
              key={journal.id}
              id={journal.id}
              title={journal.title}
              coverImage={journal.coverImage}
              summary={journal.summary}
              author={journal.author}
              totalDays={journal.totalDays}
              likeCount={journal.likeCount}
              collectCount={journal.collectCount}
            />
          ))}
        </div>
      </section>

      {/* ========== 统计条 ========== */}
      <section className="border-t bg-gray-50 py-12">
        <div className="mx-auto grid max-w-6xl grid-cols-3 gap-8 px-4 text-center">
          <div>
            <div className="text-4xl font-bold text-primary">—</div>
            <div className="mt-1 text-sm text-gray-500">篇游记</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary">—</div>
            <div className="mt-1 text-sm text-gray-500">位旅行者</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary">—</div>
            <div className="mt-1 text-sm text-gray-500">个目的地</div>
          </div>
        </div>
      </section>
    </div>
  );
}
