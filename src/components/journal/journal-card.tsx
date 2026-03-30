import Link from "next/link";

interface JournalCardProps {
  id: string;
  title: string;
  coverImage?: string | null;
  summary?: string | null;
  author: { username: string; avatar?: string | null };
  totalDays: number;
  likeCount: number;
  collectCount: number;
}

export function JournalCard({
  id,
  title,
  coverImage,
  summary,
  author,
  totalDays,
  likeCount,
  collectCount,
}: JournalCardProps) {
  return (
    <Link href={`/journal/${id}`} className="group block">
      <div className="overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-md">
        {/* 封面图 */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          {coverImage ? (
            <img
              src={coverImage}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
              <span className="text-4xl">🌍</span>
            </div>
          )}
        </div>

        {/* 内容 */}
        <div className="p-4">
          <h3 className="mb-1 line-clamp-2 text-lg font-semibold text-gray-900 group-hover:text-primary">
            {title}
          </h3>
          {summary && (
            <p className="mb-3 line-clamp-2 text-sm text-gray-500">{summary}</p>
          )}

          {/* 作者信息 */}
          <div className="flex items-center gap-2">
            {author.avatar ? (
              <img
                src={author.avatar}
                alt={author.username}
                className="h-6 w-6 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-600">
                {author.username[0]}
              </div>
            )}
            <span className="text-sm text-gray-600">{author.username}</span>
            {totalDays > 0 && (
              <span className="text-sm text-gray-400">· {totalDays}天</span>
            )}
          </div>

          {/* 统计 */}
          <div className="mt-3 flex items-center gap-4 text-sm text-gray-400">
            <span>❤ {likeCount}</span>
            <span>⭐ {collectCount}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
