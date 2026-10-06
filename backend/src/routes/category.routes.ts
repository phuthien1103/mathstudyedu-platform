import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';

const router = Router();

// Tuyến đường công khai (Ai cũng có thể xem danh mục)
router.get('/', CategoryController.getAll);
router.get('/:slug', CategoryController.getBySlug);

// Tuyến đường chỉ ADMIN mới có quyền tạo danh mục
router.post(
  '/',
  authenticateToken,
  authorizeRoles('ADMIN'),
  CategoryController.create
);

export default router;