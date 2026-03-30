import { createServerCaller } from "@/lib/server-api";
import Link from "next/link";
import { JournalCard } from "@/components/journal/journal-card";

export const dynamic = "force-dynamic";

export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const caller = await createServerCaller();
  const result = await caller.destination.getById({ id });

  if (!result?.destination) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-6xl">📍</div>
          <h1 className="text-2xl font-bold">目的地不存在</h1>
        </div>
      </div>
    );
  }

  const { destination, journals } = result;

  // 层级导航：父级 → 当前
  const breadcrumbs = [];
  if (destination.parent) {
    breadcrumbs.push(destination.parent);
  }
  breadcrumbs.push(destination);

  return (
    <div>
      {/* 封面大图 */}
      <div className="relative h-[300px] overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-700">
        {destination.coverImage && (
          <img src={destination.coverImage} alt={destination.name} className="h-full w-full object-cover opacity-60" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="mx-auto max-w-6xl">
            {/* 面包屑 */}
            <div className="mb-3 flex items-center gap-2 text-sm text-white/70">
              <Link href="/destination" className="hover:text-white">目的地</Link>
              {breadcrumbs.map((b, i) => (
                <span key={b.id} className="flex items-center gap-2">
                  <span>/</span>
                  {i < breadcrumbs.length - 1 ? (
                    <Link href={`/destination/${b.id}`} className="hover:text-white">{b.name}</Link>
                  ) : (
                    <span className="text-white">{b.name}</span>
                  )}
                </span>
              ))}
            </div>
            <h1 className="text-4xl font-bold text-white">{destination.name}</h1>
            {destination.nameEn && <p className="mt-1 text-lg text-white/70">{destination.nameEn}</p>}
            <p className="mt-2 text-white/80">{destination.journalCount} 篇游记</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* 子目的地 */}
        {destination.children.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-4 text-xl font-bold">
              {destination.level === "continent" ? "国家" : "城市/地区"}
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {destination.children.map((child: { id: string; name: string; coverImage: string | null; journalCount: number }) => (
                <Link
                  key={child.id}
                  href={`/destination/${child.id}`}
                  className="group overflow-hidden rounded-xl border bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                    {child.coverImage ? (
                      <img src={child.coverImage} alt={child.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 text-3xl">📍</div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="font-medium text-gray-900 group-hover:text-primary">{child.name}</p>
                    <p className="text-xs text-gray-500">{child.journalCount} 篇游记</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 目的地简介 */}
        {destination.description && (
          <section className="mb-10">
            <h2 className="mb-4 text-xl font-bold">简介</h2>
            <p className="leading-relaxed text-gray-600">{destination.description}</p>
          </section>
        )}

        {/* 最佳旅行时间 */}
        {destination.bestSeason && (
          <section className="mb-10">
            <h2 className="mb-4 text-xl font-bold">最佳旅行时间</h2>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm text-blue-700">
              🗓 {destination.bestSeason}
            </div>
          </section>
        )}

        {/* 游记列表 */}
        <section>
          <h2 className="mb-4 text-xl font-bold">📖 游记</h2>
          {journals.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-500">暂无游记</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {journals.map((j) => (
                <JournalCard
                  key={j.id}
                  id={j.id}
                  title={j.title}
                  coverImage={j.coverImage}
                  summary={j.summary}
                  author={j.author}
                  totalDays={j.totalDays}
                  likeCount={j.likeCount}
                  collectCount={j.collectCount}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
