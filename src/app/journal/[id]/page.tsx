import { createServerCaller } from "@/lib/server-api";

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

  const totalExpense = journal.days.reduce(
    (sum, day) => sum + day.expenses.reduce((s, e) => s + e.amount, 0),
    0
  );

  // 按分类汇总费用
  const expenseByCategory = journal.days.reduce((acc, day) => {
    day.expenses.forEach((e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
    });
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="flex">
      {/* ========== 左侧边栏目录 ========== */}
      <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 overflow-y-auto border-r bg-white p-6 lg:block">
        <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-400">
          目录
        </h4>
        <nav className="space-y-1">
          {journal.days.map((day) => (
            <a
              key={day.id}
              href={`#day-${day.dayNumber}`}
              className="block rounded-lg px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
            >
              Day {day.dayNumber} · {day.title || "未命名"}
            </a>
          ))}
        </nav>

        {/* 行程概要 */}
        <div className="mt-8 rounded-xl bg-gray-50 p-4">
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
            行程概要
          </h4>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">天数</dt>
              <dd className="font-medium text-gray-900">{journal.totalDays} 天</dd>
            </div>
            {journal.startDate && (
              <div className="flex justify-between">
                <dt className="text-gray-500">出发</dt>
                <dd className="font-medium text-gray-900">
                  {new Date(journal.startDate).toLocaleDateString("zh-CN")}
                </dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-gray-500">花费</dt>
              <dd className="font-medium text-gray-900">
                ¥{totalExpense.toLocaleString()}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">POI</dt>
              <dd className="font-medium text-gray-900">
                {journal.days.reduce((s, d) => s + d.pois.length, 0)} 个
              </dd>
            </div>
          </dl>
        </div>

        {/* 费用统计 */}
        {Object.keys(expenseByCategory).length > 0 && (
          <div className="mt-6 rounded-xl bg-gray-50 p-4">
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
              费用统计
            </h4>
            <div className="space-y-2">
              {Object.entries(expenseByCategory).map(([category, amount]) => (
                <div key={category}>
                  <div className="mb-1 flex justify-between text-xs text-gray-500">
                    <span>{category}</span>
                    <span>¥{amount.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{
                        width: `${Math.min((amount / Math.max(totalExpense, 1)) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* ========== 主内容区 ========== */}
      <main className="min-w-0 flex-1">
        {/* 封面图 */}
        <div className="relative h-[400px] overflow-hidden bg-gray-100">
          {journal.coverImage ? (
            <img
              src={journal.coverImage}
              alt={journal.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
              <span className="text-6xl">🌍</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="mx-auto max-w-3xl">
              <h1 className="mb-3 text-4xl font-bold text-white drop-shadow-lg">
                {journal.title}
              </h1>
              <div className="flex items-center gap-3">
                {journal.author.avatar ? (
                  <img
                    src={journal.author.avatar}
                    className="h-10 w-10 rounded-full"
                    alt={journal.author.username}
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                    <span className="text-lg font-bold text-white">
                      {journal.author.username[0]}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-medium text-white">{journal.author.username}</p>
                  <p className="text-sm text-white/70">
                    {journal.publishedAt
                      ? new Date(journal.publishedAt).toLocaleDateString("zh-CN")
                      : "草稿"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 互动栏 */}
        <div className="sticky top-16 z-10 border-b bg-white/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-3xl items-center gap-6 px-4 py-3">
            <button className="flex items-center gap-1.5 text-sm text-gray-600 transition-colors hover:text-red-500">
              ❤ <span>{journal.likeCount}</span>
            </button>
            <button className="flex items-center gap-1.5 text-sm text-gray-600 transition-colors hover:text-yellow-500">
              ⭐ <span>{journal.collectCount}</span>
            </button>
            <button className="flex items-center gap-1.5 text-sm text-gray-600 transition-colors hover:text-blue-500">
              💬 <span>{journal.commentCount}</span>
            </button>
            <button className="ml-auto flex items-center gap-1.5 text-sm text-gray-600 transition-colors hover:text-primary">
              📤 分享
            </button>
          </div>
        </div>

        {/* 摘要 */}
        {journal.summary && (
          <div className="mx-auto max-w-3xl px-4 py-8">
            <p className="text-lg leading-relaxed text-gray-600">{journal.summary}</p>
          </div>
        )}

        {/* Day 时间线 */}
        <div className="mx-auto max-w-3xl px-4 pb-16">
          {journal.days.map((day, index) => (
            <article
              key={day.id}
              id={`day-${day.dayNumber}`}
              className="mb-12 scroll-mt-32"
            >
              {/* Day 标题 */}
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                  {day.dayNumber}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    📍 Day {day.dayNumber}
                    {day.title && ` · ${day.title}`}
                  </h2>
                  {day.date && (
                    <p className="text-sm text-gray-500">
                      {new Date(day.date).toLocaleDateString("zh-CN")}
                    </p>
                  )}
                </div>
              </div>

              {/* 正文 */}
              <div className="mb-6 ml-5 border-l-2 border-gray-100 pl-8">
                {day.content && (
                  <div className="prose prose-gray max-w-none">
                    {day.content.split("\n").filter(Boolean).map((paragraph, i) => (
                      <p key={i} className="mb-4 leading-relaxed text-gray-700">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}

                {/* 媒体 */}
                {day.medias.length > 0 && (
                  <div className="mt-6 grid grid-cols-2 gap-2">
                    {day.medias.map((media) => (
                      <img
                        key={media.id}
                        src={media.thumbnailUrl || media.url}
                        alt={media.caption || ""}
                        className="rounded-lg"
                      />
                    ))}
                  </div>
                )}

                {/* POI 标记 */}
                {day.pois.length > 0 && (
                  <div className="mt-6 space-y-2">
                    <h4 className="text-sm font-semibold text-gray-900">📍 POI 标记</h4>
                    {day.pois.map((poi) => (
                      <div
                        key={poi.id}
                        className="flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-3"
                      >
                        <span className="text-lg">📍</span>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{poi.name}</p>
                          {poi.address && (
                            <p className="text-xs text-gray-500">{poi.address}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 当日费用 */}
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
                          {day.expenses.map((expense) => (
                            <tr key={expense.id}>
                              <td className="px-4 py-2">{expense.category}</td>
                              <td className="px-4 py-2 text-gray-600">
                                {expense.description || "-"}
                              </td>
                              <td className="px-4 py-2 text-right font-medium">
                                ¥{expense.amount}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-gray-50 font-medium">
                          <tr>
                            <td colSpan={2} className="px-4 py-2">
                              小计
                            </td>
                            <td className="px-4 py-2 text-right">
                              ¥{day.expenses.reduce((sum, e) => sum + e.amount, 0)}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* 分割线 */}
              {index < journal.days.length - 1 && (
                <div className="my-8 border-t border-dashed border-gray-200" />
              )}
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
