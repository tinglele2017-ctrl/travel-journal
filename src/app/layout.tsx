import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TRPCProvider } from "@/lib/trpc-provider";
import { Navbar } from "@/components/layout/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Travel Journal — 记录旅途故事",
  description: "分享你的旅行故事，发现世界每一个角落",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <TRPCProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
        </TRPCProvider>
      </body>
    </html>
  );
}
