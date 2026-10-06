import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';

export const authorizeRoles = (...allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Yêu cầu xác thực tài khoản' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'Bạn không có quyền thực hiện hành động này',
      });
    }

    next();
  };
};