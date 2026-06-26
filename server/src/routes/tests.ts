import { Router, Response } from 'express';
import prisma from '../prisma.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Submit a typing test (open to anonymous users, optionally authenticated)
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { wpmGross, wpmNet, accuracy, duration, mode, correctChars, incorrectChars, mistakesJson, userId } = req.body;

    if (wpmGross === undefined || wpmNet === undefined || accuracy === undefined || !duration || !mode) {
      return res.status(400).json({ error: 'Missing required test parameters' });
    }

    const test = await prisma.typingTest.create({
      data: {
        userId: userId || null,
        wpmGross: parseFloat(wpmGross),
        wpmNet: parseFloat(wpmNet),
        accuracy: parseFloat(accuracy),
        duration: parseInt(duration),
        mode,
        correctChars: parseInt(correctChars || 0),
        incorrectChars: parseInt(incorrectChars || 0),
        mistakesJson: mistakesJson || '{}',
      },
    });

    // Update streak if user is logged in
    if (userId) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user) {
        const now = new Date();
        let newStreak = user.dailyStreak;

        if (!user.lastTestDate) {
          newStreak = 1;
        } else {
          const lastDate = new Date(user.lastTestDate);
          
          // Compare dates by resetting hours/minutes/seconds
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          const lastTestDay = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());
          const diffTime = today.getTime() - lastTestDay.getTime();
          const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays === 1) {
            newStreak += 1;
          } else if (diffDays > 1) {
            newStreak = 1;
          }
          // If diffDays === 0, it is the same day, so keep the current streak!
        }

        await prisma.user.update({
          where: { id: userId },
          data: {
            dailyStreak: newStreak,
            lastTestDate: now,
          },
        });
      }
    }

    return res.status(201).json(test);
  } catch (error) {
    console.error('Submit test error:', error);
    return res.status(500).json({ error: 'Internal server error saving test results' });
  }
});

// Get user typing history (requires auth)
router.get('/history', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const tests = await prisma.typingTest.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50, // Get last 50 tests
    });

    return res.json(tests);
  } catch (error) {
    console.error('History error:', error);
    return res.status(500).json({ error: 'Internal server error fetching history' });
  }
});

// Get user profile statistics (requires auth or public view if userId provided in query)
router.get('/stats', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.query.userId as string || req.headers['x-user-id'] as string;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const tests = await prisma.typingTest.findMany({
      where: { userId },
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { dailyStreak: true, createdAt: true, username: true, displayName: true, avatarUrl: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (tests.length === 0) {
      return res.json({
        bestWpm: 0,
        avgWpm: 0,
        avgAccuracy: 0,
        totalTests: 0,
        totalTimeSeconds: 0,
        dailyStreak: user.dailyStreak,
        joinedAt: user.createdAt,
        user,
      });
    }

    let bestWpm = 0;
    let sumWpm = 0;
    let sumAccuracy = 0;
    let totalTime = 0;

    tests.forEach((t) => {
      if (t.wpmNet > bestWpm) {
        bestWpm = t.wpmNet;
      }
      sumWpm += t.wpmNet;
      sumAccuracy += t.accuracy;
      totalTime += t.duration;
    });

    return res.json({
      bestWpm: parseFloat(bestWpm.toFixed(1)),
      avgWpm: parseFloat((sumWpm / tests.length).toFixed(1)),
      avgAccuracy: parseFloat((sumAccuracy / tests.length).toFixed(1)),
      totalTests: tests.length,
      totalTimeSeconds: totalTime,
      dailyStreak: user.dailyStreak,
      joinedAt: user.createdAt,
      user,
    });
  } catch (error) {
    console.error('Stats error:', error);
    return res.status(500).json({ error: 'Internal server error fetching statistics' });
  }
});

export default router;
