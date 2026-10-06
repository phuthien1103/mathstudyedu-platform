import { Router } from 'express';
import {
  enrollCourse,
  getMyEnrollments,
  getAdminEnrollments,
  updateEnrollmentStatus,
} from '../controllers/enrollment.controller.js';
import { authenticate, authorizeAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/', authenticate, enrollCourse);
router.get('/my', authenticate, getMyEnrollments);
router.get('/admin', authenticate, authorizeAdmin, getAdminEnrollments);
router.patch('/admin/:id/status', authenticate, authorizeAdmin, updateEnrollmentStatus);

export default router;