import { Router } from 'express';
import { CourseController } from '../controllers/course.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';

const router = Router();

router.get('/', CourseController.getAll);
router.get('/:slug', CourseController.getBySlug);

router.post(
  '/',
  authenticateToken,
  authorizeRoles('INSTRUCTOR', 'ADMIN'),
  CourseController.create
);
// Thêm vào cùng danh sách route trong file
router.post(
  '/:courseId/modules',
  authenticateToken,
  authorizeRoles('INSTRUCTOR', 'ADMIN'),
  CourseController.createModule
);

router.post(
  '/modules/:moduleId/lessons',
  authenticateToken,
  authorizeRoles('INSTRUCTOR', 'ADMIN'),
  CourseController.createLesson
);

export default router;