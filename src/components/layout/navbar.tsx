import Link from "next/link";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-gray-900">
          🌍 Travel Journal
        </Link>

        {/* 导航链接 */}
        <div className="hidden items-center gap-6 sm:flex">
          <Link
            href="/destination"
            className="text-sm text-gray-600 transition-colors hover:text-gray-900"
          >
            目的地
          </Link>
          <Link
            href="/explore"
            className="text-sm text-gray-600 transition-colors hover:text-gray-900"
          >
            游记
          </Link>
        </div>

        {/* 右侧操作 */}
        <div className="flex items-center gap-3">
          {/* 搜索按钮 */}
          <Link
            href="/search"
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            🔍
          </Link>

          {/* 写游记 */}
          <Link
            href="/write"
            className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
          >
            写游记
          </Link>
        </div>
      </div>
    </nav>
  );
}
