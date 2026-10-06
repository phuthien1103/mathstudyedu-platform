import { Router } from 'express';
import { QuizController } from '../controllers/quiz.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';

const router = Router();

router.use(authenticateToken);

// Dành cho Giảng viên / Quản trị viên
router.post('/lessons/:lessonId', authorizeRoles('INSTRUCTOR', 'ADMIN'), QuizController.createQuiz);
router.post('/:quizId/questions', authorizeRoles('INSTRUCTOR', 'ADMIN'), QuizController.addQuestion);

// Dành cho Học viên
router.get('/:quizId', QuizController.getQuiz);
router.post('/:quizId/submit', QuizController.submitQuiz);

export default router;