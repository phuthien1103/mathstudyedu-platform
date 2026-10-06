import prisma from '../config/prisma.js';
import { CourseStatus } from '@prisma/client';

export class CourseService {
  static async createCourse(data: {
    title: string;
    slug: string;
    description?: string;
    price?: number;
    thumbnailUrl?: string;
    instructorId: string;
    categoryId?: string;
  }) {
    const existingCourse = await prisma.course.findUnique({
      where: { slug: data.slug },
    });

    if (existingCourse) {
      throw new Error('Đường dẫn khóa học (slug) đã tồn tại');
    }

    return await prisma.course.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        price: data.price ?? 0,
        thumbnailUrl: data.thumbnailUrl,
        instructorId: data.instructorId,
        categoryId: data.categoryId,
        status: CourseStatus.PUBLISHED,
      },
      include: {
        instructor: {
          select: { id: true, fullName: true, email: true },
        },
      },
    });
  }

  static async getAllCourses() {
    return await prisma.course.findMany({
      where: { status: CourseStatus.PUBLISHED },
      include: {
        instructor: {
          select: { id: true, fullName: true },
        },
        category: true,
        _count: {
          select: { modules: true, enrollments: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getCourseBySlug(slug: string) {
    const course = await prisma.course.findUnique({
      where: { slug },
      include: {
        instructor: {
          select: { id: true, fullName: true, bio: true },
        },
        category: true,
        modules: {
          orderBy: { order: 'asc' },
          include: {
            lessons: {
              orderBy: { order: 'asc' },
              select: {
                id: true,
                title: true,
                duration: true,
                isFree: true,
                order: true,
              },
            },
          },
        },
      },
    });

    if (!course) {
      throw new Error('Không tìm thấy khóa học');
    }

    return course;
  }
  // 1. Tạo Chương mục (Module) mới cho khóa học
  static async createModule(courseId: string, data: { title: string; order: number }) {
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new Error('Không tìm thấy khóa học');

    return await prisma.module.create({
      data: {
        title: data.title,
        order: data.order,
        courseId: courseId,
      },
    });
  }

  // 2. Tạo Bài học (Lesson) mới nằm trong Module
  static async createLesson(moduleId: string, data: {
    title: string;
    videoUrl?: string;
    content?: string;
    duration?: number;
    order: number;
    isFree?: boolean;
  }) {
    const moduleItem = await prisma.module.findUnique({ where: { id: moduleId } });
    if (!moduleItem) throw new Error('Không tìm thấy chương mục');

    return await prisma.lesson.create({
      data: {
        title: data.title,
        videoUrl: data.videoUrl,
        content: data.content,
        duration: data.duration ?? 0,
        order: data.order,
        isFree: data.isFree ?? false,
        moduleId: moduleId,
      },
    });
  }
}
