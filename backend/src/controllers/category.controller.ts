import { Request, Response } from 'express';
import { CategoryService } from '../services/category.service.js';

export class CategoryController {
  static async create(req: Request, res: Response) {
    try {
      const { name, slug, description } = req.body;

      if (!name || !slug) {
        return res.status(400).json({ message: 'Tên danh mục và slug là bắt buộc' });
      }

      const category = await CategoryService.createCategory({ name, slug, description });
      return res.status(201).json({
        message: 'Tạo danh mục thành công',
        category,
      });
    } catch (error) {
      return res.status(400).json({ message: (error as Error).message });
    }
  }

  static async getAll(_req: Request, res: Response) {
    try {
      const categories = await CategoryService.getAllCategories();
      return res.status(200).json({ categories });
    } catch (error) {
      return res.status(500).json({ message: (error as Error).message });
    }
  }

  static async getBySlug(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      const category = await CategoryService.getCategoryBySlug(slug);
      return res.status(200).json({ category });
    } catch (error) {
      return res.status(404).json({ message: (error as Error).message });
    }
  }
}