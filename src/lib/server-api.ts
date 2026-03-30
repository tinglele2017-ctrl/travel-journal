import { appRouter } from "@/server/routers/_app";
import { createTRPCContext } from "@/server/trpc";

export async function createServerCaller() {
  const ctx = await createTRPCContext({});
  return appRouter.createCaller(ctx);
}

// 降级 caller：数据库不可用时返回空数据
export async function createSafeCaller() {
  try {
    const ctx = await createTRPCContext({});
    return appRouter.createCaller(ctx);
  } catch {
    return null;
  }
}
