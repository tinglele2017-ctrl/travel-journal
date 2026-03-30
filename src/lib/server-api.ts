import { appRouter } from "@/server/routers/_app";
import { createTRPCContext } from "@/server/trpc";

// 服务端 tRPC caller，用于 SSR 数据获取
export async function createServerCaller() {
  const ctx = await createTRPCContext({});
  return appRouter.createCaller(ctx);
}
