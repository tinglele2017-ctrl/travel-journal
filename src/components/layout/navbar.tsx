import Link from "next/link";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          🌍 Travel Journal
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/explore"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            发现
          </Link>
          <Link
            href="/write"
            className="rounded-full bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors"
          >
            写游记
          </Link>
        </div>
      </div>
    </nav>
  );
}
