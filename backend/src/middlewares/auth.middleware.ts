import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';

export interface AuthRequest extends Request {
  user?: any;
}

// 1. Hàm xác thực chính
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // 1. Lấy chuỗi Bearer token từ header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Không tìm thấy token xác thực' });
    }

    const token = authHeader.split(' ')[1];

    // 2. Dùng đúng secret key mặc định nếu file .env chưa có
    const secret = process.env.JWT_SECRET || 'secret_key';

    // 3. Giải mã và gán user
    const decoded = jwt.verify(token, secret) as any;
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Lỗi giải mã JWT:', error);
    return res.status(401).json({ message: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn' });
  }
};

// 2. Export alias authenticateToken để các route khác không bị lỗi import
export const authenticateToken = authenticate;

// 3. Middleware kiểm tra quyền Quản trị viên
export const authorizeAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Bạn không có quyền quản trị viên (Admin)' });
  }
  next();
};