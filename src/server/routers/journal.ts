import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { prisma } from "@/lib/prisma";

export const journalRouter = createTRPCRouter({
  // 获取游记列表（带筛选）
  list: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(20),
        cursor: z.string().nullish(),
        destinationId: z.string().optional(),
        sortBy: z.enum(["latest", "popular", "most_collected"]).default("latest"),
      })
    )
    .query(async ({ input }) => {
      const orderBy =
        input.sortBy === "popular"
          ? { viewCount: "desc" as const }
          : input.sortBy === "most_collected"
          ? { collectCount: "desc" as const }
          : { publishedAt: "desc" as const };

      const items = await prisma.travelJournal.findMany({
        where: {
          status: "published",
          ...(input.destinationId ? { destinationId: input.destinationId } : {}),
        },
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy,
        include: {
          author: { select: { id: true, username: true, avatar: true } },
        },
      });

      let nextCursor: string | undefined;
      if (items.length > input.limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.id;
      }

      return { items, nextCursor };
    }),

  // 获取单篇游记详情
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const journal = await prisma.travelJournal.findUnique({
        where: { id: input.id },
        include: {
          author: { select: { id: true, username: true, avatar: true, bio: true } },
          days: {
            orderBy: { dayNumber: "asc" },
            include: {
              pois: { orderBy: { sortOrder: "asc" } },
              expenses: true,
              medias: { orderBy: { sortOrder: "asc" } },
            },
          },
          destination: true,
          tags: { include: { tag: true } },
        },
      });

      if (journal) {
        await prisma.travelJournal.update({
          where: { id: input.id },
          data: { viewCount: { increment: 1 } },
        });
      }

      return journal;
    }),

  // 创建游记
  create: publicProcedure
    .input(
      z.object({
        title: z.string().min(1),
        authorId: z.string(),
        coverImage: z.string().optional(),
        summary: z.string().optional(),
        destinationId: z.string().optional(),
        startDate: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return prisma.travelJournal.create({
        data: {
          title: input.title,
          authorId: input.authorId,
          coverImage: input.coverImage,
          summary: input.summary,
          destinationId: input.destinationId,
          startDate: input.startDate ? new Date(input.startDate) : undefined,
          status: "draft",
        },
      });
    }),

  // 更新游记
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        coverImage: z.string().optional(),
        summary: z.string().optional(),
        content: z.string().optional(),
        status: z.enum(["draft", "published", "archived"]).optional(),
        totalDays: z.number().optional(),
        totalCost: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return prisma.travelJournal.update({
        where: { id },
        data: {
          ...data,
          ...(input.status === "published" ? { publishedAt: new Date() } : {}),
        },
      });
    }),

  // 添加 Day
  addDay: publicProcedure
    .input(
      z.object({
        journalId: z.string(),
        dayNumber: z.number(),
        title: z.string().optional(),
        content: z.string().optional(),
        date: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return prisma.journalDay.create({
        data: {
          journalId: input.journalId,
          dayNumber: input.dayNumber,
          title: input.title,
          content: input.content,
          date: input.date ? new Date(input.date) : undefined,
        },
      });
    }),

  // 更新 Day
  updateDay: publicProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        content: z.string().optional(),
        date: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, date, ...data } = input;
      return prisma.journalDay.update({
        where: { id },
        data: {
          ...data,
          ...(date ? { date: new Date(date) } : {}),
        },
      });
    }),

  // 添加费用
  addExpense: publicProcedure
    .input(
      z.object({
        journalId: z.string(),
        dayId: z.string().optional(),
        category: z.string(),
        amount: z.number(),
        currency: z.string().default("CNY"),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return prisma.journalExpense.create({ data: input });
    }),

  // 点赞
  like: publicProcedure
    .input(z.object({ journalId: z.string(), userId: z.string() }))
    .mutation(async ({ input }) => {
      const existing = await prisma.like.findUnique({
        where: { userId_journalId: { userId: input.userId, journalId: input.journalId } },
      });
      if (existing) {
        await prisma.like.delete({ where: { id: existing.id } });
        await prisma.travelJournal.update({
          where: { id: input.journalId },
          data: { likeCount: { decrement: 1 } },
        });
        return { liked: false };
      }
      await prisma.like.create({ data: input });
      await prisma.travelJournal.update({
        where: { id: input.journalId },
        data: { likeCount: { increment: 1 } },
      });
      return { liked: true };
    }),

  // 收藏
  collect: publicProcedure
    .input(z.object({ journalId: z.string(), userId: z.string() }))
    .mutation(async ({ input }) => {
      const existing = await prisma.collection.findUnique({
        where: { userId_journalId: { userId: input.userId, journalId: input.journalId } },
      });
      if (existing) {
        await prisma.collection.delete({ where: { id: existing.id } });
        await prisma.travelJournal.update({
          where: { id: input.journalId },
          data: { collectCount: { decrement: 1 } },
        });
        return { collected: false };
      }
      await prisma.collection.create({ data: input });
      await prisma.travelJournal.update({
        where: { id: input.journalId },
        data: { collectCount: { increment: 1 } },
      });
      return { collected: true };
    }),

  // 搜索
  search: publicProcedure
    .input(
      z.object({
        query: z.string(),
        limit: z.number().min(1).max(50).default(20),
      })
    )
    .query(async ({ input }) => {
      return prisma.travelJournal.findMany({
        where: {
          status: "published",
          OR: [
            { title: { contains: input.query, mode: "insensitive" } },
            { summary: { contains: input.query, mode: "insensitive" } },
          ],
        },
        take: input.limit,
        orderBy: { viewCount: "desc" },
        include: {
          author: { select: { id: true, username: true, avatar: true } },
        },
      });
    }),
});
