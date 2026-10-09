import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import prisma from './config/prisma.js';
import authRoutes from './routes/auth.routes.js';
import enrollmentRoutes from './routes/enrollment.routes.js';
import courseRoutes from './routes/course.routes.js';
import categoryRoutes from './routes/category.routes.js';
import quizRoutes from './routes/quiz.routes.js';
import path from 'path';
import uploadRoutes from './routes/upload.routes.js';
import documentRoutes from './routes/document.routes.js';
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/uploads', (req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(path.resolve(process.cwd(), 'uploads')));
app.use('/uploads', express.static(path.resolve(process.cwd(), 'backend', 'uploads')));
app.use('/uploads', express.static(path.resolve(process.cwd(), 'src', 'uploads')));
app.use('/uploads', express.static(path.resolve(process.cwd(), 'backend', 'src', 'uploads')));
// Route upload file
app.use('/api/upload', uploadRoutes);

// Định tuyến API
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/documents', documentRoutes);

app.get('/api/health', async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      status: 'OK',
      database: 'Connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      database: 'Disconnected',
      error: (error as Error).message,
    });
  }
});

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});