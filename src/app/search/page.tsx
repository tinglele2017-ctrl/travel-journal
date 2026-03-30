"use client";

import { useState } from "react";

// 搜索结果示例数据（后续接入 tRPC）
const MOCK_RESULTS = [
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
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("全部");

  const filters = ["全部", "游记", "目的地"];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* 搜索框 */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索游记、目的地..."
            className="w-full rounded-full border px-6 py-4 pr-12 text-lg shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-xl">
            🔍
          </button>
        </div>
      </div>

      {/* 筛选栏 */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                activeFilter === f
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {["目的地 ▾", "时间 ▾", "排序 ▾"].map((label) => (
            <button
              key={label}
              className="rounded-full border px-3 py-1.5 text-sm text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-50"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 结果 */}
      <div className="mb-4 text-sm text-gray-500">
        找到 <span className="font-medium text-gray-900">{MOCK_RESULTS.length}</span> 条结果
      </div>

      <div className="space-y-4">
        {MOCK_RESULTS.map((journal) => (
          <SearchResultCard key={journal.id} journal={journal} />
        ))}
      </div>
    </div>
  );
}

function SearchResultCard({
  journal,
}: {
  journal: (typeof MOCK_RESULTS)[0];
}) {
  return (
    <a
      href={`/journal/${journal.id}`}
      className="group flex gap-4 rounded-xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      {/* 封面 */}
      <div className="aspect-[4/3] w-32 shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:w-40">
        {journal.coverImage ? (
          <img
            src={journal.coverImage}
            alt={journal.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-3xl">
            🌍
          </div>
        )}
      </div>

      {/* 内容 */}
      <div className="min-w-0 flex-1">
        <h3 className="mb-1 line-clamp-1 text-lg font-semibold text-gray-900 group-hover:text-primary">
          {journal.title}
        </h3>
        <p className="mb-3 line-clamp-2 text-sm text-gray-500">{journal.summary}</p>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span>{journal.author.username}</span>
          <span>{journal.totalDays} 天</span>
          <span>❤ {journal.likeCount}</span>
          <span>⭐ {journal.collectCount}</span>
        </div>
      </div>
    </a>
  );
}
