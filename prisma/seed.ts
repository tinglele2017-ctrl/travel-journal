import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL || "";
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // 清空数据
  await prisma.like.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.journalTag.deleteMany();
  await prisma.journalExpense.deleteMany();
  await prisma.journalPOI.deleteMany();
  await prisma.media.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.journalDay.deleteMany();
  await prisma.travelJournal.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.user.deleteMany();
  await prisma.destination.deleteMany();

  // 创建目的地层级
  const asia = await prisma.destination.create({
    data: { name: "亚洲", nameEn: "Asia", level: "continent" },
  });
  const japan = await prisma.destination.create({
    data: { name: "日本", nameEn: "Japan", level: "country", parentId: asia.id },
  });
  const iceland = await prisma.destination.create({
    data: { name: "冰岛", nameEn: "Iceland", level: "country", parentId: (await prisma.destination.create({
      data: { name: "欧洲", nameEn: "Europe", level: "continent" },
    })).id },
  });
  const nz = await prisma.destination.create({
    data: { name: "新西兰", nameEn: "New Zealand", level: "country", parentId: (await prisma.destination.create({
      data: { name: "大洋洲", nameEn: "Oceania", level: "continent" },
    })).id },
  });
  const morocco = await prisma.destination.create({
    data: { name: "摩洛哥", nameEn: "Morocco", level: "country", parentId: (await prisma.destination.create({
      data: { name: "非洲", nameEn: "Africa", level: "continent" },
    })).id },
  });
  const kyoto = await prisma.destination.create({
    data: { name: "京都", nameEn: "Kyoto", level: "city", parentId: japan.id },
  });
  const reykjavik = await prisma.destination.create({
    data: { name: "雷克雅未克", nameEn: "Reykjavik", level: "city", parentId: iceland.id, journalCount: 1 },
  });

  // 创建用户
  const user1 = await prisma.user.create({
    data: { username: "小明", avatar: null, bio: "旅行是认识自己的方式", location: "上海" },
  });
  const user2 = await prisma.user.create({
    data: { username: "旅人甲", avatar: null, bio: "世界那么大", location: "北京" },
  });
  const user3 = await prisma.user.create({
    data: { username: "花花", avatar: null, bio: "用镜头记录世界", location: "深圳" },
  });

  // 创建标签
  const tag自驾 = await prisma.tag.create({ data: { name: "自驾", type: "theme" } });
  const tag亲子 = await prisma.tag.create({ data: { name: "亲子", type: "theme" } });
  const tag美食 = await prisma.tag.create({ data: { name: "美食", type: "theme" } });

  // 创建游记
  const j1 = await prisma.travelJournal.create({
    data: {
      title: "冰岛环岛自驾 14 天完整攻略",
      coverImage: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=1200&h=800&fit=crop",
      summary: "从雷克雅未克出发，逆时针环岛，途经黄金圈、南岸、东部峡湾、北部阿克雷里、西部斯奈山半岛...",
      authorId: user1.id,
      destinationId: reykjavik.id,
      status: "published",
      totalDays: 14,
      totalCost: 32000,
      likeCount: 128,
      collectCount: 64,
      commentCount: 23,
      viewCount: 2340,
      startDate: new Date("2026-02-01"),
      publishedAt: new Date("2026-02-20"),
    },
  });

  const j2 = await prisma.travelJournal.create({
    data: {
      title: "迷失京都：寺庙与抹茶之旅",
      coverImage: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&h=800&fit=crop",
      summary: "5天深度游京都，从伏见稻荷到岚山竹林，体验最地道的日本文化...",
      authorId: user2.id,
      destinationId: kyoto.id,
      status: "published",
      totalDays: 5,
      totalCost: 8500,
      likeCount: 96,
      collectCount: 48,
      commentCount: 15,
      viewCount: 1850,
      startDate: new Date("2026-03-01"),
      publishedAt: new Date("2026-03-10"),
    },
  });

  const j3 = await prisma.travelJournal.create({
    data: {
      title: "新西兰南岛自驾：中土世界现实版",
      coverImage: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=1200&h=800&fit=crop",
      summary: "10天南岛自驾路线，从基督城到皇后镇，穿越雪山、冰川、湖泊...",
      authorId: user3.id,
      destinationId: nz.id,
      status: "published",
      totalDays: 10,
      totalCost: 25000,
      likeCount: 203,
      collectCount: 98,
      commentCount: 31,
      viewCount: 3120,
      startDate: new Date("2026-01-15"),
      publishedAt: new Date("2026-02-01"),
    },
  });

  const j4 = await prisma.travelJournal.create({
    data: {
      title: "摩洛哥：撒哈拉沙漠与蓝色小镇",
      coverImage: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=1200&h=800&fit=crop",
      summary: "从卡萨布兰卡到马拉喀什，骑骆驼穿越撒哈拉，住沙漠帐篷看星空...",
      authorId: user1.id,
      destinationId: morocco.id,
      status: "published",
      totalDays: 8,
      totalCost: 18000,
      likeCount: 76,
      collectCount: 41,
      commentCount: 12,
      viewCount: 1200,
      startDate: new Date("2025-12-20"),
      publishedAt: new Date("2026-01-05"),
    },
  });

  // 更新目的地游记数
  await prisma.destination.update({ where: { id: reykjavik.id }, data: { journalCount: 1 } });
  await prisma.destination.update({ where: { id: iceland.id }, data: { journalCount: 1 } });
  await prisma.destination.update({ where: { id: kyoto.id }, data: { journalCount: 1 } });
  await prisma.destination.update({ where: { id: japan.id }, data: { journalCount: 1 } });
  await prisma.destination.update({ where: { id: nz.id }, data: { journalCount: 1 } });
  await prisma.destination.update({ where: { id: morocco.id }, data: { journalCount: 1 } });

  // 创建 Day 内容
  await prisma.journalDay.createMany({
    data: [
      { journalId: j1.id, dayNumber: 1, title: "抵达雷克雅未克", date: new Date("2026-02-01"), content: "经过 12 小时的飞行，终于在凌晨抵达了凯夫拉维克机场。取到车的那一刻，兴奋感瞬间盖过了疲惫。我们租了一辆四驱 SUV，考虑到冰岛冬天的路况，这是必须的。" },
      { journalId: j1.id, dayNumber: 2, title: "黄金圈经典路线", date: new Date("2026-02-02"), content: "今天是经典的黄金圈一日游：Þingvellir 国家公园 → Geysir 间歇泉 → Gullfoss 黄金瀑布。Þingvellir 是两个大陆板块的交界处，走在裂缝之间，脚下踩着的是地球的\"伤疤\"。" },
      { journalId: j1.id, dayNumber: 3, title: "南岸瀑布与黑沙滩", date: new Date("2026-02-03"), content: "今天是冰岛南岸：Seljalandsfoss 瀑布 → Skógafoss 瀑布 → Reynisfjara 黑沙滩。Seljalandsfoss 是可以走到瀑布后面去的！" },
      { journalId: j2.id, dayNumber: 1, title: "抵达京都", date: new Date("2026-03-01"), content: "新干线从东京到京都，2小时15分。入住花见小路附近的町屋民宿，推开门的瞬间就被日式庭院的宁静击中了。" },
      { journalId: j2.id, dayNumber: 2, title: "伏见稻荷大社", date: new Date("2026-03-02"), content: "千本鸟居名不虚传。清晨6点到的，人不多，光影从鸟居间隙洒下来，像是走进了另一个世界。" },
      { journalId: j3.id, dayNumber: 1, title: "抵达基督城", date: new Date("2026-01-15"), content: "南岛之旅从基督城开始。取车后直接开往 Lake Tekapo，一路上的风景已经让人窒息。" },
      { journalId: j4.id, dayNumber: 1, title: "卡萨布兰卡", date: new Date("2025-12-20"), content: "哈桑二世清真寺在大西洋岸边矗立，日落时分的剪影太震撼了。晚上在 Rick's Cafe 吃了顿摩洛哥菜。" },
    ],
  });

  // 添加费用
  await prisma.journalExpense.createMany({
    data: [
      { journalId: j1.id, category: "交通", amount: 800, description: "租车 14 天" },
      { journalId: j1.id, category: "餐饮", amount: 450, description: "冰岛热狗 + 晚餐" },
      { journalId: j1.id, category: "住宿", amount: 1200, description: "Vik 镇民宿" },
      { journalId: j2.id, category: "交通", amount: 300, description: "新干线" },
      { journalId: j2.id, category: "住宿", amount: 600, description: "町屋民宿" },
    ],
  });

  // 添加 POI
  await prisma.journalPOI.createMany({
    data: [
      { journalId: j1.id, name: "凯夫拉维克机场", address: "Reykjavik, Iceland", latitude: 63.985, longitude: -22.605 },
      { journalId: j1.id, name: "Gullfoss 黄金瀑布", address: "Gullfoss, Iceland", latitude: 64.327, longitude: -20.119 },
      { journalId: j2.id, name: "伏见稻荷大社", address: "Kyoto, Japan", latitude: 34.967, longitude: 135.773 },
    ],
  });

  // 添加标签关联
  await prisma.journalTag.createMany({
    data: [
      { journalId: j1.id, tagId: tag自驾.id },
      { journalId: j3.id, tagId: tag自驾.id },
      { journalId: j2.id, tagId: tag美食.id },
    ],
  });

  console.log("✅ Seeded successfully!");
  console.log(`  - ${await prisma.destination.count()} destinations`);
  console.log(`  - ${await prisma.user.count()} users`);
  console.log(`  - ${await prisma.travelJournal.count()} journals`);
  console.log(`  - ${await prisma.journalDay.count()} days`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
