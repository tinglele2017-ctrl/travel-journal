// 示例数据
const JOURNAL = {
  id: "j1",
  title: "冰岛环岛自驾 14 天完整攻略",
  coverImage: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=1200&h=600&fit=crop",
  summary: "从雷克雅未克出发，逆时针环岛，途经黄金圈、南岸、东部峡湾、北部阿克雷里、西部斯奈山半岛...",
  author: { username: "小明", avatar: null, bio: "旅行是认识自己的方式" },
  totalDays: 14,
  totalCost: 32000,
  likeCount: 128,
  collectCount: 64,
  commentCount: 23,
  startDate: "2026-02-01",
  publishedAt: "2026-02-20",
  days: [
    {
      dayNumber: 1,
      title: "抵达雷克雅未克",
      date: "2026-02-01",
      content: `经过 12 小时的飞行，终于在凌晨抵达了凯夫拉维克机场。取到车的那一刻，兴奋感瞬间盖过了疲惫。

我们租了一辆四驱 SUV，考虑到冰岛冬天的路况，这是必须的。从机场到雷克雅未克大约 45 分钟车程，沿途已经是让人心跳加速的火山岩地貌。

入住后在市中心逛了逛，吃了传说中的冰岛热狗（Bæjarins Beztu Pylsur），确实名不虚传！`,
      pois: [
        { name: "凯夫拉维克机场", address: "Reykjavik, Iceland" },
        { name: "Bæjarins Beztu Pylsur", address: "Tryggvagata 1, Reykjavik" },
      ],
      expenses: [
        { category: "交通", amount: 800, itemName: "租车 14 天" },
        { category: "餐饮", amount: 200, itemName: "冰岛热狗 + 晚餐" },
      ],
    },
    {
      dayNumber: 2,
      title: "黄金圈经典路线",
      date: "2026-02-02",
      content: `今天是经典的黄金圈一日游：Þingvellir 国家公园 → Geysir 间歇泉 → Gullfoss 黄金瀑布。

Þingvellir 是两个大陆板块的交界处，走在裂缝之间，脚下踩着的是地球的"伤疤"。这里的地质意义让任何照片都无法完全表达。

Geysir 的 Strokkur 间歇泉每隔 5-10 分钟喷发一次，水柱高达 20 米，第一次看到时忍不住惊呼。

Gullfoss 是今天的压轴——三层瀑布在峡谷中奔腾而下，冬日的冰挂让它更加壮观。`,
      pois: [
        { name: "Þingvellir 国家公园", address: "Þingvellir, Iceland" },
        { name: "Geysir 间歇泉", address: "Geysir, Iceland" },
        { name: "Gullfoss 黄金瀑布", address: "Gullfoss, Iceland" },
      ],
      expenses: [
        { category: "交通", amount: 150, itemName: "油费" },
        { category: "门票", amount: 0, itemName: "自然景点免费" },
        { category: "餐饮", amount: 250, itemName: "午餐 + 晚餐" },
      ],
    },
    {
      dayNumber: 3,
      title: "南岸瀑布与黑沙滩",
      date: "2026-02-03",
      content: `今天的行程是冰岛南岸：Seljalandsfoss 瀑布 → Skógafoss 瀑布 → Reynisfjara 黑沙滩。

Seljalandsfoss 是可以走到瀑布后面去的！虽然冬天地滑，但穿着钉鞋还是可以的。从瀑布后面看出去的景色太震撼了。

Skógafoss 是权游的取景地之一，走到瀑布下方，水雾扑面而来，整个人都湿透了但超开心。

Reynisfjara 黑沙滩是今天的惊喜。玄武岩石柱、漆黑的沙粒、还有大西洋的巨浪——这里有一种末日般的壮美。但请注意安全！疯狗浪真的会把人卷走。`,
      pois: [
        { name: "Seljalandsfoss 瀑布", address: "Seljalandsfoss, Iceland" },
        { name: "Skógafoss 瀑布", address: "Skógafoss, Iceland" },
        { name: "Reynisfjara 黑沙滩", address: "Vik, Iceland" },
      ],
      expenses: [
        { category: "交通", amount: 180, itemName: "油费" },
        { category: "餐饮", amount: 300, itemName: "午餐 + 晚餐" },
        { category: "住宿", amount: 1200, itemName: "Vik 镇民宿" },
      ],
    },
  ],
};

export default async function JournalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  void id; // will be used for fetching from DB
  const journal = JOURNAL;

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
              key={day.dayNumber}
              href={`#day-${day.dayNumber}`}
              className="block rounded-lg px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
            >
              Day {day.dayNumber} · {day.title}
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
            <div className="flex justify-between">
              <dt className="text-gray-500">出发</dt>
              <dd className="font-medium text-gray-900">{journal.startDate}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">花费</dt>
              <dd className="font-medium text-gray-900">¥{journal.totalCost.toLocaleString()}</dd>
            </div>
          </dl>
        </div>

        {/* 费用统计 */}
        <div className="mt-6 rounded-xl bg-gray-50 p-4">
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
            费用统计
          </h4>
          <div className="space-y-2">
            {[
              { label: "交通", value: 1130, color: "bg-blue-500" },
              { label: "住宿", value: 1200, color: "bg-green-500" },
              { label: "餐饮", value: 750, color: "bg-orange-500" },
              { label: "门票", value: 0, color: "bg-purple-500" },
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex justify-between text-xs text-gray-500">
                  <span>{item.label}</span>
                  <span>¥{item.value}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${Math.min((item.value / 3200) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* ========== 主内容区 ========== */}
      <main className="min-w-0 flex-1">
        {/* 封面图 */}
        <div className="relative h-[400px] overflow-hidden">
          <img
            src={journal.coverImage}
            alt={journal.title}
            className="h-full w-full object-cover"
          />
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
                  <p className="text-sm text-white/70">{journal.publishedAt}</p>
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
        <div className="mx-auto max-w-3xl px-4 py-8">
          <p className="text-lg leading-relaxed text-gray-600">{journal.summary}</p>
        </div>

        {/* Day 时间线 */}
        <div className="mx-auto max-w-3xl px-4 pb-16">
          {journal.days.map((day, index) => (
            <article
              key={day.dayNumber}
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
                    📍 Day {day.dayNumber} · {day.title}
                  </h2>
                  <p className="text-sm text-gray-500">{day.date}</p>
                </div>
              </div>

              {/* 正文 */}
              <div className="mb-6 ml-5 border-l-2 border-gray-100 pl-8">
                <div className="prose prose-gray max-w-none">
                  {day.content.split("\n\n").map((paragraph, i) => (
                    <p key={i} className="mb-4 leading-relaxed text-gray-700">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* POI 标记 */}
                {day.pois.length > 0 && (
                  <div className="mt-6 space-y-2">
                    <h4 className="text-sm font-semibold text-gray-900">📍 POI 标记</h4>
                    {day.pois.map((poi) => (
                      <div
                        key={poi.name}
                        className="flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-3"
                      >
                        <span className="text-lg">📍</span>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{poi.name}</p>
                          <p className="text-xs text-gray-500">{poi.address}</p>
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
                          {day.expenses.map((expense, i) => (
                            <tr key={i}>
                              <td className="px-4 py-2">{expense.category}</td>
                              <td className="px-4 py-2 text-gray-600">{expense.itemName}</td>
                              <td className="px-4 py-2 text-right font-medium">
                                ¥{expense.amount}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-gray-50 font-medium">
                          <tr>
                            <td colSpan={2} className="px-4 py-2">小计</td>
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
