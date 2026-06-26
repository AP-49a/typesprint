import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with sample users and scores...');

  // Clean existing data
  await prisma.certificate.deleteMany({});
  await prisma.typingTest.deleteMany({});
  await prisma.user.deleteMany({});

  const passwordHash = await bcrypt.hash('password123', 10);

  const players = [
    { username: 'monkey_fingers', email: 'monkey@typesprint.com', name: 'Monkey Fingers', wpmGross: 118, wpmNet: 115, accuracy: 98.2, streak: 12 },
    { username: 'speedy_typer', email: 'speedy@typesprint.com', name: 'Alex Thompson', wpmGross: 104, wpmNet: 101, accuracy: 97.5, streak: 8 },
    { username: 'sprint_master', email: 'sprint@typesprint.com', name: 'Sophia Chen', wpmGross: 96, wpmNet: 94, accuracy: 96.8, streak: 5 },
    { username: 'keyboard_ninja', email: 'ninja@typesprint.com', name: 'Ren Sato', wpmGross: 88, wpmNet: 85, accuracy: 95.5, streak: 3 },
    { username: 'code_racer', email: 'racer@typesprint.com', name: 'Sarah Miller', wpmGross: 78, wpmNet: 75, accuracy: 94.2, streak: 0 },
    { username: 'slow_and_steady', email: 'steady@typesprint.com', name: 'David Jones', wpmGross: 48, wpmNet: 47, accuracy: 99.1, streak: 22 },
  ];

  for (const player of players) {
    const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(player.username)}`;
    const user = await prisma.user.create({
      data: {
        username: player.username,
        email: player.email,
        passwordHash,
        displayName: player.name,
        avatarUrl,
        dailyStreak: player.streak,
        lastTestDate: new Date(),
      },
    });

    // Create a typing test for them
    const test = await prisma.typingTest.create({
      data: {
        userId: user.id,
        wpmGross: player.wpmGross,
        wpmNet: player.wpmNet,
        accuracy: player.accuracy,
        duration: 60,
        mode: 'words',
        correctChars: player.wpmNet * 5,
        incorrectChars: (player.wpmGross - player.wpmNet) * 5,
        mistakesJson: JSON.stringify({ e: 2, t: 1 }),
      },
    });

    // If eligible, create a certificate
    if (player.wpmNet >= 40 && player.accuracy >= 90) {
      const year = new Date().getFullYear();
      const randomNum = Math.floor(100000 + Math.random() * 900000);
      const certId = `TS-${year}-${randomNum}`;
      await prisma.certificate.create({
        data: {
          id: certId,
          userId: user.id,
          wpmGross: player.wpmGross,
          wpmNet: player.wpmNet,
          accuracy: player.accuracy,
        },
      });
    }
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
