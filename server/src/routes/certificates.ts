import { Router, Response } from 'express';
import prisma from '../prisma.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Get certificates for logged-in user
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const certificates = await prisma.certificate.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return res.json(certificates);
  } catch (error) {
    console.error('Fetch certificates error:', error);
    return res.status(500).json({ error: 'Internal server error fetching certificates' });
  }
});

// Generate a certificate from an eligible test ID
router.post('/generate', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { testId } = req.body;

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    if (!testId) return res.status(400).json({ error: 'Test ID is required' });

    const test = await prisma.typingTest.findUnique({
      where: { id: testId },
    });

    if (!test || test.userId !== userId) {
      return res.status(404).json({ error: 'Typing test not found or unauthorized' });
    }

    if (test.wpmNet < 40 || test.accuracy < 90) {
      return res.status(400).json({
        error: 'Test does not meet certificate requirements. Minimum WPM: 40, Minimum Accuracy: 90%.',
      });
    }

    // Check if certificate already exists for this test or if they already have one matching these stats
    const existingCert = await prisma.certificate.findFirst({
      where: {
        userId,
        wpmNet: test.wpmNet,
        accuracy: test.accuracy,
      },
    });

    if (existingCert) {
      return res.json(existingCert);
    }

    // Generate certificate ID: TS-YYYY-XXXXXX
    const year = new Date().getFullYear();
    const randomNum = Math.floor(100000 + Math.random() * 900000); // 6 digits
    const certId = `TS-${year}-${randomNum}`;

    const certificate = await prisma.certificate.create({
      data: {
        id: certId,
        userId,
        wpmGross: test.wpmGross,
        wpmNet: test.wpmNet,
        accuracy: test.accuracy,
      },
    });

    return res.status(201).json(certificate);
  } catch (error) {
    console.error('Generate certificate error:', error);
    return res.status(500).json({ error: 'Internal server error generating certificate' });
  }
});

// Verify a certificate
router.get('/verify/:id', async (req, res) => {
  try {
    const certId = req.params.id;

    const certificate = await prisma.certificate.findUnique({
      where: { id: certId },
      include: {
        user: {
          select: {
            username: true,
            displayName: true,
            createdAt: true,
          },
        },
      },
    });

    if (!certificate) {
      return res.status(404).json({ valid: false, error: 'Certificate not found or invalid' });
    }

    return res.json({
      valid: true,
      id: certificate.id,
      wpmGross: certificate.wpmGross,
      wpmNet: certificate.wpmNet,
      accuracy: certificate.accuracy,
      issuedDate: certificate.createdAt,
      username: certificate.user.username,
      displayName: certificate.user.displayName || certificate.user.username,
    });
  } catch (error) {
    console.error('Verify certificate error:', error);
    return res.status(500).json({ error: 'Internal server error verifying certificate' });
  }
});

export default router;
