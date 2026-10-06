import prisma from '../config/prisma.js';

export class CategoryService {
  static async createCategory(data: { name: string; slug: string; description?: string }) {
    const existingCategory = await prisma.category.findUnique({
      where: { slug: data.slug },
    });

    if (existingCategory) {
      throw new Error('Đường dẫn danh mục (slug) đã tồn tại');
    }

    return await prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
      },
    });
  }

  static async getAllCategories() {
    return await prisma.category.findMany({
      include: {
        _count: {
          select: { courses: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  static async getCategoryBySlug(slug: string) {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        courses: {
          where: { status: 'PUBLISHED' },
          include: {
            instructor: {
              select: { id: true, fullName: true },
            },
          },
        },
      },
    });

    if (!category) {
      throw new Error('Không tìm thấy danh mục');
    }

    return category;
  }
}