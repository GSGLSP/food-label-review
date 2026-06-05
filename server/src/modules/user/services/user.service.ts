import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    const admin = await this.prisma.user.findUnique({ where: { username: 'admin' } });
    if (!admin) {
      const hashed = await bcrypt.hash('admin123', 10);
      await this.prisma.user.create({
        data: { username: 'admin', password: hashed, realName: '管理员', role: 'admin' },
      });
      console.log('管理员账户已创建: admin / admin123');
    }
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: { id: true, username: true, realName: true, role: true, status: true, createdAt: true },
    });
  }

  async create(data: { username: string; password: string; realName: string; role?: string }) {
    const hashed = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: { ...data, password: hashed, role: data.role || 'reviewer' },
      select: { id: true, username: true, realName: true, role: true },
    });
  }

  async findByUsername(username: string) {
    return this.prisma.user.findUnique({ where: { username } });
  }
}