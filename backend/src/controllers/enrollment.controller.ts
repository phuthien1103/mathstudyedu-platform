import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/auth.middleware.js';

const prisma = new PrismaClient();


// 1. Học viên đăng ký môn học
export const enrollCourse = async (req: AuthRequest, res: Response) => {
  try {
    const { courseId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Vui lòng đăng nhập để đăng ký môn học' });
    }

    if (!courseId) {
      return res.status(400).json({ message: 'Thiếu mã môn học (courseId)' });
    }

    // Kiểm tra môn học có tồn tại không
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return res.status(404).json({ message: 'Môn học không tồn tại' });
    }

    // Kiểm tra xem đã đăng ký trước đó chưa
    const existing = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: { userId, courseId },
      },
    });

    if (existing) {
      return res.status(400).json({ 
        message: 'Bạn đã đăng ký môn học này rồi',
        status: (existing as any).status,
      });
    }

    // Tạo bản ghi đăng ký mới với trạng thái PENDING
    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        courseId,
        status: 'PENDING',
      },
      include: {
        course: {
          select: { title: true, price: true },
        },
      },
    });

    return res.status(201).json({
      message: 'Gửi yêu cầu đăng ký môn học thành công, đang chờ Admin duyệt!',
      data: enrollment,
    });
  } catch (error) {
    console.error('Lỗi đăng ký môn học:', error);
    return res.status(500).json({ message: 'Lỗi máy chủ khi đăng ký môn học' });
  }
};

// 2. Học viên lấy danh sách môn học của mình
export const getMyEnrollments = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;

    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: true,
      },
    });

    return res.json(enrollments);
  } catch (error) {
    console.error('Lỗi getMyEnrollments:', error);
    return res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};
// 3. Admin: Lấy danh sách toàn bộ học viên đăng ký và chi tiết môn học
export const getAdminEnrollments = async (req: AuthRequest, res: Response) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatarUrl: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            price: true,
            thumbnailUrl: true,
            category: { select: { name: true } },
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    });

    return res.json({ data: enrollments });
  } catch (error) {
    console.error('Lỗi lấy danh sách admin:', error);
    return res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

// 4. Admin: Duyệt hoặc Hủy đăng ký
export const updateEnrollmentStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'ACTIVE' hoặc 'CANCELLED'

    if (!['ACTIVE', 'CANCELLED', 'PENDING'].includes(status)) {
      return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
    }

    const updated = await prisma.enrollment.update({
      where: { id },
      data: { status } as any,
      include: {
        user: { select: { fullName: true, email: true } },
        course: { select: { title: true } },
      },
    });
    return res.json({
      message: 'Cập nhật trạng thái thành công',
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Không thể cập nhật trạng thái' });
  }
};