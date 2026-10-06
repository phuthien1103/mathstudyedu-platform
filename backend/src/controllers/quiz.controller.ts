import { Request, Response } from 'express';
import { QuizService } from '../services/quiz.service.js';

export class QuizController {
  static async createQuiz(req: Request, res: Response) {
    try {
      const { lessonId } = req.params;
      const { title, passingScore } = req.body;

      if (!title) {
        return res.status(400).json({ message: 'Tiêu đề bài trắc nghiệm là bắt buộc' });
      }

      const quiz = await QuizService.createQuiz(lessonId, { title, passingScore });
      return res.status(201).json({ message: 'Tạo bài trắc nghiệm thành công', quiz });
    } catch (error) {
      return res.status(400).json({ message: (error as Error).message });
    }
  }

  static async addQuestion(req: Request, res: Response) {
    try {
      const { quizId } = req.params;
      const { questionText, options, correctAnswer, points } = req.body;

      if (!questionText || !Array.isArray(options) || correctAnswer === undefined) {
        return res.status(400).json({
          message: 'questionText, mảng options và correctAnswer là bắt buộc',
        });
      }

      const question = await QuizService.addQuestion(quizId, {
        questionText,
        options,
        correctAnswer,
        points,
      });

      return res.status(201).json({ message: 'Thêm câu hỏi thành công', question });
    } catch (error) {
      return res.status(400).json({ message: (error as Error).message });
    }
  }

  static async getQuiz(req: Request, res: Response) {
    try {
      const { quizId } = req.params;
      const quiz = await QuizService.getQuizForStudent(quizId);
      return res.status(200).json({ quiz });
    } catch (error) {
      return res.status(404).json({ message: (error as Error).message });
    }
  }

  static async submitQuiz(req: Request, res: Response) {
    try {
      const { quizId } = req.params;
      const { answers } = req.body;

      if (!Array.isArray(answers)) {
        return res.status(400).json({ message: 'Danh sách answers không hợp lệ' });
      }

      const result = await QuizService.submitQuiz(req.user!.userId, quizId, answers);
      return res.status(200).json({ message: 'Nộp bài trắc nghiệm thành công', result });
    } catch (error) {
      return res.status(400).json({ message: (error as Error).message });
    }
  }
}