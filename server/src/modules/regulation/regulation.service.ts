import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

const SEED_REGULATIONS = [
  { code: 'GB 7718-2011', name: '预包装食品标签通则', category: 'GB7718', foodType: '预包装食品', effectiveDate: new Date('2012-04-20') },
  { code: 'GB 28050-2011', name: '预包装食品营养标签通则', category: 'GB28050', foodType: '预包装食品', effectiveDate: new Date('2013-01-01') },
  { code: 'GB 2760-2014', name: '食品添加剂使用标准', category: 'GB2760', foodType: '预包装食品', effectiveDate: new Date('2015-05-24') },
  { code: 'GB 2762-2017', name: '食品中污染物限量', category: 'GB2762', foodType: '预包装食品', effectiveDate: new Date('2017-09-17') },
  { code: '进口食品标签规定', name: '进口食品检验检疫监督管理办法', category: '进口食品', foodType: '进口食品', effectiveDate: null },
  { code: '农产品包装标识规定', name: '农产品包装和标识管理办法', category: '农产品', foodType: '食用农产品', effectiveDate: new Date('2006-11-01') },
];

@Injectable()
export class RegulationService {
  constructor(private prisma: PrismaService) {}

  async findAll(filter?: { category?: string; foodType?: string }) {
    return this.prisma.regulation.findMany({
      where: {
        status: 1,
        ...(filter?.category && { category: filter.category }),
        ...(filter?.foodType && { foodType: filter.foodType }),
      },
      orderBy: { code: 'asc' },
    });
  }

  async seed() {
    for (const reg of SEED_REGULATIONS) {
      await this.prisma.regulation.upsert({
        where: { code: reg.code },
        update: {},
        create: {
          code: reg.code,
          name: reg.name,
          category: reg.category,
          content: `【${reg.code} ${reg.name}】\n本标准适用于${reg.foodType}的标签审核。`,
          foodType: reg.foodType,
          effectiveDate: reg.effectiveDate,
        },
      });
    }
    return { message: '法规库已初始化', count: SEED_REGULATIONS.length };
  }
}