import { createServerCaller } from "@/lib/server-api";
import { JournalCard } from "@/components/journal/journal-card";
import { DestinationCard } from "@/components/journal/destination-card";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface JournalItem {
  id: string;
  title: string;
  coverImage: string | null;
  summary: string | null;
  author: { id: string; username: string; avatar: string | null };
  totalDays: number;
  likeCount: number;
  collectCount: number;
}

interface DestItem {
  id: string;
  name: string;
  coverImage: string | null;
  journalCount: number;
}

export default async function Home() {
  const caller = await createServerCaller();

  const [journalsResult, hotDests] = await Promise.all([
    caller.journal.list({ limit: 6, sortBy: "popular" }),
    caller.destination.hot({ limit: 5 }),
  ]);

  const journals = journalsResult.items as JournalItem[];
  const destinations = hotDests as DestItem[];

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative h-[520px] overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-800">
        <div className="absolute inset-0 flex items-center">
          {journals.slice(0, 3).map((j) => (
            <div key={j.id} className="absolute inset-0" style={{ opacity: j === journals[0] ? 1 : 0 }}>
              {j.coverImage && (
                <img src={j.coverImage} alt={j.title} className="h-full w-full object-cover opacity-40" />
              )}
            </div>
          ))}
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
          <div><div className="text-4xl font-bold text-primary">{journals.length}+</div><div className="mt-1 text-sm text-gray-500">篇游记</div></div>
          <div><div className="text-4xl font-bold text-primary">3</div><div className="mt-1 text-sm text-gray-500">位旅行者</div></div>
          <div><div className="text-4xl font-bold text-primary">{destinations.length}</div><div className="mt-1 text-sm text-gray-500">个目的地</div></div>
        </div>
      </section>
    </div>
  );
}
