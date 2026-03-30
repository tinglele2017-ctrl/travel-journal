import { Button } from "@/components/ui/button";

export default function WritePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">写游记</h1>

      <div className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium">标题</label>
          <input
            type="text"
            placeholder="给你的游记起个标题..."
            className="w-full rounded-lg border px-4 py-3 text-lg focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">目的地</label>
          <input
            type="text"
            placeholder="你去了哪里？"
            className="w-full rounded-lg border px-4 py-3 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">游记内容</label>
          <textarea
            rows={12}
            placeholder="写下你的旅途故事..."
            className="w-full rounded-lg border px-4 py-3 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
          />
        </div>

        <div className="flex gap-4">
          <Button size="lg">发布游记</Button>
          <Button variant="outline" size="lg">
            存为草稿
          </Button>
        </div>
      </div>
    </div>
  );
}
