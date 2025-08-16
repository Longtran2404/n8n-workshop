import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Create a sample user (creator)
  const user = await prisma.user.upsert({
    where: { email: 'creator@example.com' },
    update: {},
    create: {
      email: 'creator@example.com',
      name: 'Creator One',
      avatarText: 'CO',
    },
  });

  // 5 sample workflows
  for (let i = 1; i <= 5; i++) {
    await prisma.workflow.upsert({
      where: { slug: `sample-workflow-${i}` },
      update: {},
      create: {
        slug: `sample-workflow-${i}`,
        title: `Sample Workflow ${i}`,
        description: `Mô tả workflow mẫu số ${i}`,
        platform: 'n8n',
        categories: ['Automation'],
        tags: ['gmail', 'sheets'],
        difficulty: 'Beginner',
        version: '1.0.0',
        authorId: user.id,
        priceType: i % 2 === 0 ? 'paid' : 'free',
        priceAmount: i % 2 === 0 ? 99000 : 0,
        priceCurrency: 'VND',
        assets: {},
        attachments: {},
        guide: {},
        ratingAvg: 4.5,
        ratingCount: 10,
        stats: {},
        status: 'published',
      },
    });
  }

  // 2 sample courses
  // (You can expand with a Course model later)

  // 1 sample doc
  // (You can expand with a Doc model later)
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
