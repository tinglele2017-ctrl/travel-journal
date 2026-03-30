import { createTRPCRouter } from "../trpc";
import { journalRouter } from "./journal";
import { destinationRouter } from "./destination";

export const appRouter = createTRPCRouter({
  journal: journalRouter,
  destination: destinationRouter,
});

export type AppRouter = typeof appRouter;
