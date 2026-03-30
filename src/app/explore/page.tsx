import { createServerCaller } from "@/lib/server-api";
import { JournalCard } from "@/components/journal/journal-card";

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

export default async function ExplorePage() {
  const caller = await createServerCaller();
  const { items } = await caller.journal.list({ limit: 12, sortBy: "latest" });
  const journals = items as JournalItem[];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold">发现精彩游记</h1>
      <p className="mb-8 text-gray-500">探索旅行者们的旅途故事</p>
      {journals.length === 0 ? (
        <div className="py-20 text-center"><div className="mb-4 text-5xl">📭</div><p className="text-gray-500">还没有游记，快来写第一篇吧！</p></div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {journals.map((j) => (
            <JournalCard key={j.id} id={j.id} title={j.title} coverImage={j.coverImage} summary={j.summary} author={j.author} totalDays={j.totalDays} likeCount={j.likeCount} collectCount={j.collectCount} />
          ))}
        </div>
      )}
    </div>
  );
}
