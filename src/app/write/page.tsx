"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "@/components/journal/rich-text-editor";
import { useCurrentUser } from "@/components/user-provider";
import { trpc } from "@/lib/trpc-provider";

interface DayEntry {
  id: number;
  title: string;
  date: string;
  content: string;
}

export default function WritePage() {
  const router = useRouter();
  const { currentUser } = useCurrentUser();
  const [title, setTitle] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [destination, setDestination] = useState("");
  const [summary, setSummary] = useState("");
  const [startDate, setStartDate] = useState("");
  const [days, setDays] = useState<DayEntry[]>([
    { id: 1, title: "", date: "", content: "" },
  ]);
  const [saving, setSaving] = useState(false);

  const createJournal = trpc.journal.create.useMutation();
  const addDay = trpc.journal.addDay.useMutation();

  const addDayEntry = () => {
    setDays([...days, { id: days.length + 1, title: "", date: "", content: "" }]);
  };

  const updateDay = (id: number, field: keyof DayEntry, value: string) => {
    setDays(days.map((d) => (d.id === id ? { ...d, [field]: value } : d)));
  };

  const removeDay = (id: number) => {
    if (days.length <= 1) return;
    setDays(days.filter((d) => d.id !== id));
  };

  const handleSave = async (status: "draft" | "published") => {
    if (!currentUser || !title.trim()) return;
    setSaving(true);

    try {
      const journal = await createJournal.mutateAsync({
        title: title.trim(),
        authorId: currentUser.id,
        coverImage: coverImage || undefined,
        summary: summary || undefined,
        startDate: startDate || undefined,
      });

      // 添加 Day
      for (const day of days) {
        if (day.title || day.content) {
          await addDay.mutateAsync({
            journalId: journal.id,
            dayNumber: day.id,
            title: day.title || undefined,
            content: day.content || undefined,
            date: day.date || undefined,
          });
        }
      }

      // 如果发布，更新状态
      if (status === "published") {
        // TODO: update journal status
      }

      router.push(`/journal/${journal.id}`);
    } catch (err) {
      console.error("Save failed:", err);
      alert("保存失败，请重试");
    } finally {
      setSaving(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-5xl">👤</div>
          <h2 className="text-xl font-bold">请先选择用户身份</h2>
          <p className="mt-2 text-sm text-gray-500">点击右下角按钮选择身份后即可写游记</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <section className="mb-8">
        <h1 className="mb-6 text-2xl font-bold">✏️ 写游记</h1>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">游记标题</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="给你的游记起个标题..."
              className="w-full rounded-lg border px-4 py-3 text-lg focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">封面图 URL</label>
              <input
                type="text"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://example.com/cover.jpg"
                className="w-full rounded-lg border px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">目的地</label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="你去了哪里？"
                className="w-full rounded-lg border px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">出发日期</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-lg border px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">游记摘要</label>
              <input
                type="text"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="一句话概括你的旅程..."
                className="w-full rounded-lg border px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mb-8 space-y-6">
        {days.map((day, index) => (
          <div key={day.id} className="rounded-xl border bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b bg-gray-50 px-4 py-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                {index + 1}
              </div>
              <span className="font-medium text-gray-700">📅 Day {index + 1}</span>
              {days.length > 1 && (
                <button onClick={() => removeDay(day.id)} className="ml-auto text-sm text-red-400 hover:text-red-600">
                  删除
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 gap-3 border-b px-4 py-3 sm:grid-cols-2">
              <input
                type="text"
                value={day.title}
                onChange={(e) => updateDay(day.id, "title", e.target.value)}
                placeholder="当天标题，如「抵达东京」"
                className="rounded border px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
              <input
                type="date"
                value={day.date}
                onChange={(e) => updateDay(day.id, "date", e.target.value)}
                className="rounded border px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </div>
            <div className="p-4">
              <RichTextEditor
                content={day.content}
                onUpdate={(html) => updateDay(day.id, "content", html)}
                placeholder={`写下 Day ${index + 1} 的旅途故事...`}
              />
            </div>
          </div>
        ))}
        <button
          onClick={addDayEntry}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 py-4 text-gray-400 transition-colors hover:border-primary hover:text-primary"
        >
          <span className="text-xl">+</span>
          <span className="font-medium">添加新的一天</span>
        </button>
      </section>

      <div className="sticky bottom-0 -mx-4 flex gap-3 border-t bg-white/80 px-4 py-4 backdrop-blur-md">
        <Button
          variant="outline"
          size="lg"
          onClick={() => handleSave("draft")}
          disabled={saving || !title.trim()}
        >
          💾 {saving ? "保存中..." : "保存草稿"}
        </Button>
        <Button
          size="lg"
          className="ml-auto"
          onClick={() => handleSave("published")}
          disabled={saving || !title.trim()}
        >
          🚀 {saving ? "发布中..." : "发布游记"}
        </Button>
      </div>
    </div>
  );
}
