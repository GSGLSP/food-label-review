import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class ReportService {
  constructor(private prisma: PrismaService) {}

  async generateReport(reviewId: number) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        label: true,
        reviewer: { select: { realName: true } },
        items: true,
      },
    });
    if (!review) return null;

    const passItems = review.items.filter((i) => i.result === 'pass');
    const failItems = review.items.filter((i) => i.result === 'fail');
    const naItems = review.items.filter((i) => i.result === 'not_applicable');

    const reportNo = `FLR-${Date.now()}`;
    const content = {
      reportNo,
      labelNo: review.label.labelNo,
      foodName: review.label.foodName,
      foodType: review.label.foodType,
      overallResult:
        review.overallResult ||
        (failItems.length > 0 ? 'fail' : 'pass'),
      summary: {
        total: review.items.length,
        pass: passItems.length,
        fail: failItems.length,
        notApplicable: naItems.length,
        passRate: `${Math.round((passItems.length / (review.items.length - naItems.length)) * 100)}%`,
      },
      items: review.items.map((item) => ({
        category: item.category,
        checkName: item.checkName,
        regulation: item.regulation,
        result: item.result,
        issue: item.issue,
        suggestion: item.suggestion,
        severity: item.severity,
      })),
      reviewer: review.reviewer.realName,
      reviewedAt: review.updatedAt,
      generatedAt: new Date(),
    };

    return this.prisma.report.upsert({
      where: { reviewId },
      update: { content: JSON.stringify(content) },
      create: { reviewId, reportNo, content: JSON.stringify(content) },
    });
  }

  async findAll() {
    return this.prisma.report.findMany({
      include: {
        review: {
          include: {
            label: true,
            reviewer: { select: { realName: true } },
          },
        },
      },
      orderBy: { generatedAt: 'desc' },
    });
  }

  async findOne(reviewId: number) {
    return this.prisma.report.findUnique({ where: { reviewId } });
  }
}