import Link from "next/link";

interface DestinationCardProps {
  id: string;
  name: string;
  coverImage?: string | null;
  journalCount: number;
}

export function DestinationCard({
  id,
  name,
  coverImage,
  journalCount,
}: DestinationCardProps) {
  return (
    <Link href={`/destination/${id}`} className="group block">
      <div className="relative overflow-hidden rounded-xl">
        {/* 封面图 */}
        <div className="aspect-[3/4] overflow-hidden bg-gray-100">
          {coverImage ? (
            <img
              src={coverImage}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100">
              <span className="text-5xl">📍</span>
            </div>
          )}
        </div>

        {/* 渐变遮罩 + 文字 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-lg font-bold text-white">{name}</h3>
          <p className="text-sm text-white/80">{journalCount} 篇游记</p>
        </div>
      </div>
    </Link>
  );
}
