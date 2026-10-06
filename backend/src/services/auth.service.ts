import prisma from '../config/prisma.js';
import { hashPassword, comparePassword, generateTokens } from '../utils/auth.js';

export class AuthService {
  static async register(data: { email: string; password: string; fullName: string }) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error('Email đã được sử dụng');
    }

    const passwordHash = await hashPassword(data.password);

    const newUser = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        fullName: data.fullName,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
      },
    });

    const tokens = generateTokens({ userId: newUser.id, role: newUser.role });

    return { user: newUser, ...tokens };
  }

  static async login(data: { email: string; password: string }) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new Error('Email hoặc mật khẩu không chính xác');
    }

    const isValidPassword = await comparePassword(data.password, user.passwordHash);
    if (!isValidPassword) {
      throw new Error('Email hoặc mật khẩu không chính xác');
    }

    const tokens = generateTokens({ userId: user.id, role: user.role });

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
      ...tokens,
    };
  }
}