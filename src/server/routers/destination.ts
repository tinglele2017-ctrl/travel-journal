import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { prisma } from "@/lib/prisma";

export const destinationRouter = createTRPCRouter({
  // 获取目的地列表
  list: publicProcedure
    .input(
      z.object({
        level: z.enum(["continent", "country", "city"]).optional(),
        parentId: z.string().optional(),
        limit: z.number().min(1).max(50).default(20),
      })
    )
    .query(async ({ input }) => {
      return prisma.destination.findMany({
        where: {
          ...(input.level ? { level: input.level } : {}),
          ...(input.parentId ? { parentId: input.parentId } : { parentId: null }),
        },
        orderBy: { journalCount: "desc" },
        take: input.limit,
      });
    }),

  // 获取目的地详情
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const destination = await prisma.destination.findUnique({
        where: { id: input.id },
        include: {
          children: { orderBy: { journalCount: "desc" } },
          parent: true,
        },
      });

      const journals = await prisma.travelJournal.findMany({
        where: { destinationId: input.id, status: "published" },
        take: 12,
        orderBy: { publishedAt: "desc" },
        include: {
          author: { select: { id: true, username: true, avatar: true } },
        },
      });

      return { destination, journals };
    }),

  // 热门目的地
  hot: publicProcedure
    .input(z.object({ limit: z.number().default(10) }))
    .query(async ({ input }) => {
      return prisma.destination.findMany({
        where: { level: "country", journalCount: { gt: 0 } },
        orderBy: { journalCount: "desc" },
        take: input.limit,
      });
    }),
});
