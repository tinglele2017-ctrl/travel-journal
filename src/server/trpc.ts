import { initTRPC } from "@trpc/server";
import superjson from "superjson";

export const createTRPCContext = async (opts: { req?: Request; resHeaders?: Headers }) => {
  return {
    ...opts,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
});

export const createCallerFactory = t.createCallerFactory;
export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
