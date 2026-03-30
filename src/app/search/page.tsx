import Link from "next/link";

export const dynamic = "force-dynamic";

interface JournalItem {
  id: string; title: string; coverImage: string | null; summary: string | null;
  author: { id: string; username: string; avatar: string | null };
  totalDays: number; likeCount: number; collectCount: number;
}

const FALLBACK: JournalItem[] = [
  { id: "1", title: "冰岛环岛自驾 14 天完整攻略", coverImage: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=600&h=450&fit=crop", summary: "从雷克雅未克出发，逆时针环岛，途经黄金圈、南岸、东部峡湾...", author: { id: "1", username: "小明", avatar: null }, totalDays: 14, likeCount: 128, collectCount: 64 },
  { id: "2", title: "迷失京都：寺庙与抹茶之旅", coverImage: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&h=450&fit=crop", summary: "5天深度游京都，从伏见稻荷到岚山竹林，体验最地道的日本文化...", author: { id: "2", username: "旅人甲", avatar: null }, totalDays: 5, likeCount: 96, collectCount: 48 },
];

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  let results = FALLBACK;
  try {
    if (q) {
      const { createServerCaller } = await import("@/lib/server-api");
      const caller = await createServerCaller();
      const raw = await caller.journal.search({ query: q });
      results = raw as JournalItem[];
    }
  } catch {}

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <form className="mb-6">
        <div className="relative">
          <input type="text" name="q" defaultValue={q} placeholder="搜索游记、目的地..." className="w-full rounded-full border px-6 py-4 pr-12 text-lg shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
          <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-xl">🔍</button>
        </div>
      </form>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
          {["全部", "游记", "目的地"].map((f) => (<button key={f} className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${f === "全部" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>{f}</button>))}
        </div>
      </div>
      {q && <div className="mb-4 text-sm text-gray-500">找到 <span className="font-medium text-gray-900">{results.length}</span> 条结果</div>}
      <div className="space-y-4">
        {results.map((j) => (
          <Link key={j.id} href={`/journal/${j.id}`} className="group flex gap-4 rounded-xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
            <div className="aspect-[4/3] w-32 shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:w-40">
              {j.coverImage ? <img src={j.coverImage} alt={j.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" /> : <div className="flex h-full w-full items-center justify-center text-3xl">🌍</div>}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="mb-1 line-clamp-1 text-lg font-semibold text-gray-900 group-hover:text-primary">{j.title}</h3>
              {j.summary && <p className="mb-3 line-clamp-2 text-sm text-gray-500">{j.summary}</p>}
              <div className="flex items-center gap-4 text-sm text-gray-400"><span>{j.author.username}</span><span>{j.totalDays} 天</span><span>❤ {j.likeCount}</span><span>⭐ {j.collectCount}</span></div>
            </div>
          </Link>
        ))}
      </div>
      {!q && <div className="py-20 text-center"><div className="mb-4 text-5xl">🔍</div><p className="text-gray-500">输入关键词搜索游记</p></div>}
    </div>
  );
}
