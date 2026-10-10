import { Router } from 'express';
import { register, login, updateProfile } from '../controllers/auth.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);

// Đường dẫn cập nhật số điện thoại
router.patch('/profile', authenticateToken, updateProfile);

export default router;