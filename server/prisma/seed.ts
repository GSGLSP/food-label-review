import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashed = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: { username: 'admin', password: hashed, realName: '系统管理员', role: 'admin' },
  });
  console.log('管理员账号: admin / admin123');
}

main().catch(console.error).finally(() => prisma.$disconnect());