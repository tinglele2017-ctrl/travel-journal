import { createServerCaller } from "@/lib/server-api";
import { JournalInteractions } from "@/components/journal/journal-interactions";

export const dynamic = "force-dynamic";

export default async function JournalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const caller = await createServerCaller();
  const journal = await caller.journal.getById({ id });

  if (!journal) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-6xl">📭</div>
          <h1 className="text-2xl font-bold text-gray-900">游记不存在</h1>
          <p className="mt-2 text-gray-500">这篇游记可能已被删除或尚未发布</p>
        </div>
      </div>
    );
  }

  const expenseByCategory = journal.days.reduce((acc, day) => {
    day.expenses.forEach((e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
    });
    return acc;
  }, {} as Record<string, number>);
  const totalExpense = Object.values(expenseByCategory).reduce((a, b) => a + b, 0);

  const authorJournals = await caller.journal.list({ limit: 3, sortBy: "latest" });
  const otherJournals = authorJournals.items.filter((j) => j.id !== id).slice(0, 2);

  return (
    <div className="flex">
      {/* 侧边栏 */}
      <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 overflow-y-auto border-r bg-white p-6 lg:block">
        <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-400">目录</h4>
        <nav className="space-y-1">
          {journal.days.map((day) => (
            <a key={day.id} href={`#day-${day.dayNumber}`}
              className="block rounded-lg px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900">
              Day {day.dayNumber} · {day.title || "未命名"}
            </a>
          ))}
        </nav>
        <div className="mt-8 rounded-xl bg-gray-50 p-4">
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">行程概要</h4>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">天数</dt>
              <dd className="font-medium">{journal.totalDays} 天</dd>
            </div>
            {journal.startDate && (
              <div className="flex justify-between">
                <dt className="text-gray-500">出发</dt>
                <dd className="font-medium">{new Date(journal.startDate).toLocaleDateString("zh-CN")}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-gray-500">花费</dt>
              <dd className="font-medium">¥{totalExpense.toLocaleString()}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">POI</dt>
              <dd className="font-medium">{journal.days.reduce((s, d) => s + d.pois.length, 0)} 个</dd>
            </div>
          </dl>
        </div>
        {Object.keys(expenseByCategory).length > 0 && (
          <div className="mt-6 rounded-xl bg-gray-50 p-4">
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">费用统计</h4>
            <div className="space-y-2">
              {Object.entries(expenseByCategory).map(([cat, amount]) => (
                <div key={cat}>
                  <div className="mb-1 flex justify-between text-xs text-gray-500">
                    <span>{cat}</span><span>¥{amount.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-gray-200">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min((amount / Math.max(totalExpense, 1)) * 100, 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {otherJournals.length > 0 && (
          <div className="mt-6">
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">更多游记</h4>
            <div className="space-y-3">
              {otherJournals.map((j) => (
                <a key={j.id} href={`/journal/${j.id}`} className="group block">
                  {j.coverImage && <img src={j.coverImage} alt={j.title} className="aspect-[16/9] w-full rounded-lg object-cover" />}
                  <p className="mt-1.5 text-xs font-medium text-gray-700 line-clamp-1 group-hover:text-primary">{j.title}</p>
                </a>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* 主内容 */}
      <main className="min-w-0 flex-1">
        <div className="relative h-[400px] overflow-hidden bg-gray-100">
          {journal.coverImage ? (
            <img src={journal.coverImage} alt={journal.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 text-6xl">🌍</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="mx-auto max-w-3xl">
              <h1 className="mb-3 text-4xl font-bold text-white drop-shadow-lg">{journal.title}</h1>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                  <span className="text-lg font-bold text-white">{journal.author.username[0]}</span>
                </div>
                <div>
                  <p className="font-medium text-white">{journal.author.username}</p>
                  <p className="text-sm text-white/70">
                    {journal.publishedAt ? new Date(journal.publishedAt).toLocaleDateString("zh-CN") : "草稿"}
                    {" · "}{journal.viewCount} 次阅读
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 互动栏（客户端） */}
        <JournalInteractions
          journalId={journal.id}
          likeCount={journal.likeCount}
          collectCount={journal.collectCount}
          commentCount={journal.commentCount}
        />

        {journal.summary && (
          <div className="mx-auto max-w-3xl px-4 py-8">
            <p className="text-lg leading-relaxed text-gray-600">{journal.summary}</p>
          </div>
        )}

        {/* Day 时间线 */}
        <div className="mx-auto max-w-3xl px-4">
          {journal.days.map((day, index) => (
            <article key={day.id} id={`day-${day.dayNumber}`} className="mb-12 scroll-mt-32">
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">{day.dayNumber}</div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">📍 Day {day.dayNumber}{day.title && ` · ${day.title}`}</h2>
                  {day.date && <p className="text-sm text-gray-500">{new Date(day.date).toLocaleDateString("zh-CN")}</p>}
                </div>
              </div>
              <div className="mb-6 ml-5 border-l-2 border-gray-100 pl-8">
                {day.content && (
                  <div className="prose prose-gray max-w-none">
                    {day.content.split("\n").filter(Boolean).map((p, i) => (
                      <p key={i} className="mb-4 leading-relaxed text-gray-700">{p}</p>
                    ))}
                  </div>
                )}
                {day.medias.length > 0 && (
                  <div className="mt-6 grid grid-cols-2 gap-2">
                    {day.medias.map((m) => (
                      <img key={m.id} src={m.thumbnailUrl || m.url} alt={m.caption || ""} className="rounded-lg" />
                    ))}
                  </div>
                )}
                {day.pois.length > 0 && (
                  <div className="mt-6 space-y-2">
                    <h4 className="text-sm font-semibold text-gray-900">📍 POI 标记</h4>
                    {day.pois.map((poi) => (
                      <div key={poi.id} className="flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-3">
                        <span className="text-lg">📍</span>
                        <div>
                          <p className="text-sm font-medium">{poi.name}</p>
                          {poi.address && <p className="text-xs text-gray-500">{poi.address}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {day.expenses.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-semibold text-gray-900">💰 当日费用</h4>
                    <div className="mt-2 overflow-hidden rounded-lg border">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-gray-500">类目</th>
                            <th className="px-4 py-2 text-left text-gray-500">说明</th>
                            <th className="px-4 py-2 text-right text-gray-500">金额</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {day.expenses.map((e) => (
                            <tr key={e.id}>
                              <td className="px-4 py-2">{e.category}</td>
                              <td className="px-4 py-2 text-gray-600">{e.description || "-"}</td>
                              <td className="px-4 py-2 text-right font-medium">¥{e.amount}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-gray-50 font-medium">
                          <tr>
                            <td colSpan={2} className="px-4 py-2">小计</td>
                            <td className="px-4 py-2 text-right">¥{day.expenses.reduce((s, e) => s + e.amount, 0)}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                )}
              </div>
              {index < journal.days.length - 1 && <div className="my-8 border-t border-dashed border-gray-200" />}
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
