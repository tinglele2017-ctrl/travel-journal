import { createTRPCRouter } from "../trpc";
// import { journalRouter } from "./journal";
// import { userRouter } from "./user";

export const appRouter = createTRPCRouter({
  // journal: journalRouter,
  // user: userRouter,
});

export type AppRouter = typeof appRouter;
