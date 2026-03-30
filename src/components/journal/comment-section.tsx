"use client";

import { useState } from "react";

interface Comment {
  id: string;
  content: string;
  author: { username: string; avatar: string | null };
  createdAt: string;
  replies?: Comment[];
}

interface CommentSectionProps {
  journalId: string;
  userId: string | null;
  initialComments?: Comment[];
}

const MOCK_COMMENTS: Comment[] = [
  {
    id: "c1",
    content: "太羡慕了！冰岛一直是我的梦想目的地，特别是那些瀑布和黑沙滩。",
    author: { username: "旅行小白", avatar: null },
    createdAt: "2026-02-25",
    replies: [
      {
        id: "c1r1",
        content: "强烈推荐冬天去，虽然冷但看到极光的概率很高！",
        author: { username: "小明", avatar: null },
        createdAt: "2026-02-25",
      },
    ],
  },
  {
    id: "c2",
    content: "费用好详细！请问租车是在哪个平台订的？",
    author: { username: "攻略党", avatar: null },
    createdAt: "2026-02-26",
    replies: [],
  },
  {
    id: "c3",
    content: "Day 3 的黑沙滩照片能再发几张吗？好想去！",
    author: { username: "摄影爱好者", avatar: null },
    createdAt: "2026-03-01",
    replies: [],
  },
];

export function CommentSection({ journalId: _journalId, userId, initialComments }: CommentSectionProps) {
  void _journalId; // will be used for tRPC mutation
  const [comments, setComments] = useState<Comment[]>(initialComments || MOCK_COMMENTS);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !userId) return;
    // TODO: tRPC mutation - for now add locally
    const newC: Comment = {
      id: `new-${Date.now()}`,
      content: newComment,
      author: { username: "当前用户", avatar: null },
      createdAt: new Date().toLocaleDateString("zh-CN"),
      replies: [],
    };
    setComments([newC, ...comments]);
    setNewComment("");
  };

  const handleReply = (parentId: string) => {
    if (!replyText.trim() || !userId) return;
    const reply: Comment = {
      id: `reply-${Date.now()}`,
      content: replyText,
      author: { username: "当前用户", avatar: null },
      createdAt: new Date().toLocaleDateString("zh-CN"),
    };
    setComments(
      comments.map((c) =>
        c.id === parentId
          ? { ...c, replies: [...(c.replies || []), reply] }
          : c
      )
    );
    setReplyText("");
    setReplyTo(null);
  };

  return (
    <section id="comments" className="scroll-mt-32">
      <h3 className="mb-6 text-xl font-bold text-gray-900">
        💬 评论 ({comments.length})
      </h3>

      {/* 发表评论 */}
      {userId ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="写下你的想法..."
            rows={3}
            className="w-full rounded-lg border px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <div className="mt-2 flex justify-end">
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              发表评论
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-8 rounded-lg bg-gray-50 p-4 text-center text-sm text-gray-500">
          请先选择用户身份
        </div>
      )}

      {/* 评论列表 */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id}>
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-600">
                {comment.author.username[0]}
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">{comment.author.username}</span>
                  <span className="text-xs text-gray-400">{comment.createdAt}</span>
                </div>
                <p className="text-sm leading-relaxed text-gray-700">{comment.content}</p>
                {userId && (
                  <button
                    onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                    className="mt-1.5 text-xs text-gray-400 transition-colors hover:text-primary"
                  >
                    回复
                  </button>
                )}

                {replyTo === comment.id && (
                  <div className="mt-3 flex gap-2">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={`回复 @${comment.author.username}...`}
                      className="flex-1 rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none"
                    />
                    <button
                      onClick={() => handleReply(comment.id)}
                      className="rounded-lg bg-primary px-3 py-2 text-xs text-white"
                    >
                      回复
                    </button>
                  </div>
                )}

                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-4 space-y-3 border-l-2 border-gray-100 pl-4">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex gap-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-200 text-[10px] font-medium text-gray-600">
                          {reply.author.username[0]}
                        </div>
                        <div>
                          <div className="mb-0.5 flex items-center gap-2">
                            <span className="text-xs font-medium">{reply.author.username}</span>
                            <span className="text-[10px] text-gray-400">{reply.createdAt}</span>
                          </div>
                          <p className="text-xs leading-relaxed text-gray-700">{reply.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
