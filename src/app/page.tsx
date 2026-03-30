import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {/* Hero Section */}
      <section className="mb-16 text-center">
        <h1 className="mb-4 text-5xl font-bold tracking-tight">
          记录旅途，分享故事
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600">
          每一次出发都是一段独特的旅程。用 Travel Journal 记下你的足迹，
          让世界看到你眼中的风景。
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg">开始写游记</Button>
          <Button variant="outline" size="lg">
            发现精彩
          </Button>
        </div>
      </section>

      {/* Featured Journals Placeholder */}
      <section>
        <h2 className="mb-6 text-2xl font-semibold">精选游记</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="group overflow-hidden rounded-xl border bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="aspect-[4/3] bg-gray-100 animate-pulse" />
              <div className="p-4">
                <div className="mb-2 h-5 w-3/4 rounded bg-gray-100 animate-pulse" />
                <div className="mb-3 h-4 w-full rounded bg-gray-100 animate-pulse" />
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-gray-100 animate-pulse" />
                  <div className="h-3 w-16 rounded bg-gray-100 animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Placeholder */}
      <section className="mt-16 rounded-2xl bg-gray-50 p-8">
        <div className="grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-gray-900">—</div>
            <div className="text-sm text-gray-500">篇游记</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900">—</div>
            <div className="text-sm text-gray-500">位旅行者</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900">—</div>
            <div className="text-sm text-gray-500">个目的地</div>
          </div>
        </div>
      </section>
    </div>
  );
}
