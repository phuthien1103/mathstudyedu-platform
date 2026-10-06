import { Request, Response } from 'express';
import { CourseService } from '../services/course.service.js';

export class CourseController {
  static async create(req: Request, res: Response) {
    try {
      const { title, slug, description, price, thumbnailUrl, categoryId } = req.body;

      if (!title || !slug) {
        return res.status(400).json({ message: 'Tiêu đề và slug là bắt buộc' });
      }

      const course = await CourseService.createCourse({
        title,
        slug,
        description,
        price,
        thumbnailUrl,
        categoryId,
        instructorId: req.user!.userId,
      });

      return res.status(201).json({
        message: 'Tạo khóa học thành công',
        course,
      });
    } catch (error) {
      return res.status(400).json({ message: (error as Error).message });
    }
  }

  static async getAll(_req: Request, res: Response) {
    try {
      const courses = await CourseService.getAllCourses();
      return res.status(200).json({ courses });
    } catch (error) {
      return res.status(500).json({ message: (error as Error).message });
    }
  }

  static async getBySlug(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      const course = await CourseService.getCourseBySlug(slug);
      return res.status(200).json({ course });
    } catch (error) {
      return res.status(404).json({ message: (error as Error).message });
    }
  }
  static async createModule(req: Request, res: Response) {
    try {
      const { courseId } = req.params;
      const { title, order } = req.body;

      if (!title || order === undefined) {
        return res.status(400).json({ message: 'Tiêu đề và thứ tự (order) là bắt buộc' });
      }

      const newModule = await CourseService.createModule(courseId, { title, order });
      return res.status(201).json({ message: 'Tạo chương mục thành công', module: newModule });
    } catch (error) {
      return res.status(400).json({ message: (error as Error).message });
    }
  }

  static async createLesson(req: Request, res: Response) {
    try {
      const { moduleId } = req.params;
      const { title, videoUrl, content, duration, order, isFree } = req.body;

      if (!title || order === undefined) {
        return res.status(400).json({ message: 'Tiêu đề và thứ tự bài học là bắt buộc' });
      }

      const lesson = await CourseService.createLesson(moduleId, {
        title,
        videoUrl,
        content,
        duration,
        order,
        isFree,
      });

      return res.status(201).json({ message: 'Tạo bài học thành công', lesson });
    } catch (error) {
      return res.status(400).json({ message: (error as Error).message });
    }
  }
}