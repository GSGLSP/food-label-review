import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ReviewItem } from '@prisma/client';

const REVIEW_CHECKLIST: Record<string, Array<{
  category: string; checkName: string; regulation: string; severity: string;
}>> = {
  '预包装食品': [
    { category: '必备标识', checkName: '食品名称', regulation: 'GB 7718-2011 4.1.1', severity: 'critical' },
    { category: '配料表', checkName: '配料表完整性与排列顺序', regulation: 'GB 7718-2011 4.1.3.1', severity: 'critical' },
    { category: '配料表', checkName: '过敏原提示', regulation: 'GB 7718-2011 4.4.2', severity: 'major' },
    { category: '必备标识', checkName: '净含量和规格', regulation: 'GB 7718-2011 4.1.5', severity: 'critical' },
    { category: '必备标识', checkName: '生产者/经销者信息', regulation: 'GB 7718-2011 4.1.1.2', severity: 'critical' },
    { category: '日期标注', checkName: '生产日期', regulation: 'GB 7718-2011 2.5', severity: 'critical' },
    { category: '日期标注', checkName: '保质期', regulation: 'GB 7718-2011 4.1.7', severity: 'critical' },
    { category: '必备标识', checkName: '贮存条件', regulation: 'GB 7718-2011 4.1.8', severity: 'major' },
    { category: '必备标识', checkName: '食品生产许可证编号', regulation: 'SC发证要求', severity: 'critical' },
    { category: '营养成分', checkName: '营养成分表（能量、蛋白质、脂肪、碳水化合物、钠）', regulation: 'GB 28050-2011 4.1', severity: 'critical' },
    { category: '营养成分', checkName: '营养成分表四列格式', regulation: 'GB 28050-2011 表1', severity: 'major' },
    { category: '营养成分', checkName: 'NRV%标注', regulation: 'GB 28050-2011 6.2', severity: 'major' },
  ],
  '食用农产品': [
    { category: '必备标识', checkName: '产品名称', regulation: '农产品包装标识规定', severity: 'critical' },
    { category: '必备标识', checkName: '产地', regulation: '农产品包装标识规定', severity: 'major' },
    { category: '必备标识', checkName: '生产者/销售者信息', regulation: '农产品包装标识规定', severity: 'critical' },
    { category: '日期标注', checkName: '生产日期', regulation: '农产品包装标识规定', severity: 'major' },
    { category: '日期标注', checkName: '保质期（如适用）', regulation: '农产品包装标识规定', severity: 'minor' },
  ],
  '进口食品': [
    { category: '必备标识', checkName: '原产国/地区', regulation: '进口食品标签规定', severity: 'critical' },
    { category: '必备标识', checkName: '国内进口商/经销商信息', regulation: '进口食品标签规定', severity: 'critical' },
    { category: '必备标识', checkName: '中文标签完整性', regulation: '进口食品标签规定', severity: 'critical' },
    { category: '配料表', checkName: '配料表（含过敏原）', regulation: 'GB 7718-2011', severity: 'major' },
    { category: '营养成分', checkName: '营养成分表', regulation: 'GB 28050-2011', severity: 'major' },
    { category: '必备标识', checkName: '生产日期和保质期', regulation: 'GB 7718-2011', severity: 'critical' },
  ],
};

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async createReview(labelId: number, reviewerId: number) {
    const label = await this.prisma.label.findUnique({ where: { id: labelId } });
    if (!label) throw new NotFoundException('标签不存在');
    if (!label.ocrText) throw new BadRequestException('请先完成OCR识别');

    const foodType = label.foodType || '预包装食品';
    const checklist = REVIEW_CHECKLIST[foodType] || REVIEW_CHECKLIST['预包装食品'];
    const ocrData = JSON.parse(label.ocrText);

    const review = await this.prisma.review.create({
      data: { labelId, reviewerId, status: 'reviewing' },
    });

    const items = checklist.map((item) => ({
      reviewId: review.id,
      category: item.category,
      checkName: item.checkName,
      regulation: item.regulation,
      severity: item.severity,
      result: 'pending',
    }));

    await this.prisma.reviewItem.createMany({ data: items });

    // AI辅助判断（基于OCR数据模拟）
    await this.aiAssistReview(review.id, ocrData, checklist);

    return this.getReviewWithItems(review.id);
  }

  private async aiAssistReview(reviewId: number, ocrData: any, checklist: any[]) {
    const updates: Array<{ id: number; result: string; issue?: string; suggestion?: string }> = [];

    for (const item of checklist) {
      const reviewItem = await this.prisma.reviewItem.findFirst({
        where: { reviewId, checkName: item.checkName },
      });
      if (!reviewItem) continue;

      let result = 'pass', issue = '', suggestion = '';

      if (item.checkName === '食品名称') {
        if (!ocrData.foodName) { result = 'fail'; issue = '未标注食品名称'; suggestion = '应在显著位置标注食品专用名称'; }
      } else if (item.checkName === '配料表完整性与排列顺序') {
        if (!ocrData.ingredients) { result = 'fail'; issue = '未找到配料表'; suggestion = '必须标注配料表，按递减顺序排列'; }
      } else if (item.checkName === '净含量和规格') {
        if (!ocrData.netContent) { result = 'fail'; issue = '未标注净含量'; suggestion = '应标注净含量，格式：数字+单位'; }
      } else if (item.checkName === '生产日期') {
        if (!ocrData.productionDate) { result = 'fail'; issue = '未标注生产日期'; suggestion = '必须清晰标注生产日期'; }
      } else if (item.checkName === '保质期') {
        if (!ocrData.expiryDate) { result = 'fail'; issue = '未标注保质期'; suggestion = '必须标注保质期及到期日'; }
      } else if (item.checkName === '营养成分表（能量、蛋白质、脂肪、碳水化合物、钠）') {
        if (!ocrData.nutritionFacts) { result = 'fail'; issue = '未找到营养成分表'; suggestion = '应标注能量、蛋白质、脂肪、碳水化合物、钠五项'; }
      } else if (item.checkName === '过敏原提示') {
        if (!ocrData.allergens) { result = 'fail'; issue = '未标注过敏原提示'; suggestion = '含麸质、甲壳类、蛋类、鱼类、花生、大豆、乳、坚果等应标注提示'; }
      } else if (item.checkName === '中文标签完整性') {
        if (!ocrData.foodName || !ocrData.ingredients) { result = 'fail'; issue = '中文标签信息不完整'; suggestion = '进口食品必须标注完整的中文标签'; }
      } else if (item.checkName === '原产国/地区') {
        if (!ocrData.origin) { result = 'fail'; issue = '未标注原产国/地区'; suggestion = '必须标注食品原产国/地区'; }
      }

      if (reviewItem.result === 'pending') {
        await this.prisma.reviewItem.update({
          where: { id: reviewItem.id },
          data: { result, issue, suggestion },
        });
      }
    }
  }

  async findAll(filter?: { status?: string; foodType?: string }) {
    return this.prisma.review.findMany({
      where: {
        ...(filter?.status && { status: filter.status }),
        ...(filter?.foodType && { label: { foodType: filter.foodType } }),
      },
      include: {
        label: { include: { uploadUser: { select: { realName: true } } } },
        reviewer: { select: { realName: true } },
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    return this.getReviewWithItems(id);
  }

  async updateItem(itemId: number, data: { result: string; issue?: string; suggestion?: string }) {
    return this.prisma.reviewItem.update({ where: { id: itemId }, data });
  }

  async submitReview(reviewId: number, overallResult: string) {
    const items = await this.prisma.reviewItem.findMany({ where: { reviewId } });
    const failCount = items.filter((i) => i.result === 'fail').length;
    return this.prisma.review.update({
      where: { id: reviewId },
      data: { status: overallResult === 'pass' ? 'approved' : 'rejected', overallResult },
    });
  }

  private async getReviewWithItems(id: number) {
    const review = await this.prisma.review.findUnique({
      where: { id },
      include: {
        label: { include: { uploadUser: { select: { realName: true } } } },
        reviewer: { select: { realName: true } },
        items: true,
      },
    });
    if (!review) throw new NotFoundException('审核不存在');
    return review;
  }
}