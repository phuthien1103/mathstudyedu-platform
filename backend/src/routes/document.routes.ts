import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// API lấy danh sách tài liệu
router.get('/', async (req, res) => {
  try {
    const documents = await prisma.document.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(documents);
  } catch (error) {
    console.error('Lỗi lấy tài liệu:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy tài liệu' });
  }
});

export default router;