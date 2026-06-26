import { Router, Response, Request } from 'express';
import prisma from '../prisma.js';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const timeframe = req.query.timeframe as string || 'alltime';
    const search = req.query.search as string || '';
    const page = parseInt(req.query.page as string || '1');
    const limit = parseInt(req.query.limit as string || '10');
    const skip = (page - 1) * limit;

    let dateFilter: any = {};
    if (timeframe === 'weekly') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      dateFilter = { createdAt: { gte: oneWeekAgo } };
    } else if (timeframe === 'monthly') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
      dateFilter = { createdAt: { gte: oneMonthAgo } };
    }

    // Retrieve users with their best test in this timeframe
    const users = await prisma.user.findMany({
      where: search ? {
        OR: [
          { username: { contains: search, mode: 'insensitive' } },
          { displayName: { contains: search, mode: 'insensitive' } },
        ]
      } : {},
      include: {
        tests: {
          where: {
            userId: { not: null },
            ...dateFilter
          },
          orderBy: {
            wpmNet: 'desc'
          },
          take: 1
        }
      }
    });

    // Map, sort, and paginate in-memory
    const allRankings = users
      .filter(u => u.tests.length > 0)
      .map(u => ({
        userId: u.id,
        username: u.username,
        displayName: u.displayName || u.username,
        avatarUrl: u.avatarUrl,
        bestWpm: u.tests[0].wpmNet,
        accuracy: u.tests[0].accuracy,
        date: u.tests[0].createdAt,
      }))
      .sort((a, b) => b.bestWpm - a.bestWpm);

    const total = allRankings.length;
    const paginatedRankings = allRankings.slice(skip, skip + limit);

    return res.json({
      rankings: paginatedRankings,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    return res.status(500).json({ error: 'Internal server error fetching leaderboard' });
  }
});

export default router;
