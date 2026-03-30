"use client";

import { LikeCollectBar } from "@/components/journal/like-collect-bar";
import { CommentSection } from "@/components/journal/comment-section";
import { useCurrentUser } from "@/components/user-provider";

export function JournalInteractions({
  journalId,
  likeCount,
  collectCount,
  commentCount,
}: {
  journalId: string;
  likeCount: number;
  collectCount: number;
  commentCount: number;
}) {
  const { currentUser } = useCurrentUser();
  const userId = currentUser?.id ?? null;

  return (
    <>
      <LikeCollectBar
        journalId={journalId}
        likeCount={likeCount}
        collectCount={collectCount}
        commentCount={commentCount}
        userId={userId}
      />
      <div className="mx-auto max-w-3xl px-4 pb-16">
        <CommentSection journalId={journalId} userId={userId} />
      </div>
    </>
  );
}
