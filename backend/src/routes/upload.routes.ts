import { Router } from 'express';
import { UploadController } from '../controllers/upload.controller.js';
import { upload } from '../middlewares/upload.middleware.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = Router();

// Yêu cầu đăng nhập trước khi upload file (input key: "image")
router.post(
  '/image',
  authenticateToken,
  upload.single('image'),
  UploadController.uploadImage
);

export default router;