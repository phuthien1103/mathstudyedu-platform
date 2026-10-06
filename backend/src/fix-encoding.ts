import prisma from './config/prisma.js';

async function fixVietnameseText() {
  console.log('🔄 Đang đồng bộ và sửa lại font chữ tiếng Việt...');

  // 1. Sửa bảng User
  await prisma.user.updateMany({
    where: { email: 'student@openedu.vn' },
    data: { fullName: 'Nguyễn Văn Học Viên' },
  });

  // 2. Sửa bảng Course
  await prisma.course.updateMany({
    where: { slug: 'lap-trinh-typescript-nodejs' },
    data: {
      title: 'Lập trình TypeScript và Node.js chuyên sâu',
      description: 'Khóa học xây dựng LMS hiện đại từ cơ bản đến nâng cao',
    },
  });

  // 3. Sửa bảng Module
  await prisma.module.updateMany({
    where: { order: 1 },
    data: {
      title: 'Chương 1: Tổng quan và Khởi tạo dự án',
    },
  });

  // 4. Sửa bảng Lesson
  await prisma.lesson.updateMany({
    where: { order: 1 },
    data: {
      title: 'Bài 1: Giới thiệu hệ thống OpenEdu',
    },
  });

  console.log('✅ Đã sửa và chuẩn hóa toàn bộ font chữ tiếng Việt thành công!');
}

fixVietnameseText()
  .catch((err) => {
    console.error('Lỗi cập nhật:', err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });