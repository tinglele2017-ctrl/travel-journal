"use client";

import { useState } from "react";

interface LikeCollectProps {
  journalId: string;
  likeCount: number;
  collectCount: number;
  commentCount: number;
}

export function LikeCollectBar({
  journalId: _journalId,
  likeCount: initialLike,
  collectCount: initialCollect,
  commentCount,
}: LikeCollectProps) {
  void _journalId; // will be used for tRPC mutation
  const [liked, setLiked] = useState(false);
  const [collected, setCollected] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLike);
  const [collectCount, setCollectCount] = useState(initialCollect);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    // TODO: tRPC mutation
  };

  const handleCollect = () => {
    setCollected(!collected);
    setCollectCount(collected ? collectCount - 1 : collectCount + 1);
    // TODO: tRPC mutation
  };

  return (
    <div className="sticky top-16 z-10 border-b bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-3xl items-center gap-6 px-4 py-3">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 text-sm transition-colors ${
            liked ? "text-red-500" : "text-gray-600 hover:text-red-500"
          }`}
        >
          {liked ? "❤️" : "🤍"} <span>{likeCount}</span>
        </button>
        <button
          onClick={handleCollect}
          className={`flex items-center gap-1.5 text-sm transition-colors ${
            collected ? "text-yellow-500" : "text-gray-600 hover:text-yellow-500"
          }`}
        >
          {collected ? "⭐" : "☆"} <span>{collectCount}</span>
        </button>
        <a
          href="#comments"
          className="flex items-center gap-1.5 text-sm text-gray-600 transition-colors hover:text-blue-500"
        >
          💬 <span>{commentCount}</span>
        </a>
        <button className="ml-auto flex items-center gap-1.5 text-sm text-gray-600 transition-colors hover:text-primary">
          📤 分享
        </button>
      </div>
    </div>
  );
}
