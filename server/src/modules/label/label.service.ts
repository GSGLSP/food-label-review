import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLabelDto } from './dto/create-label.dto';

@Injectable()
export class LabelService {
  constructor(private prisma: PrismaService) {}

  async createLabel(dto: CreateLabelDto & { imageUrl: string }) {
    return this.prisma.label.create({
      data: {
        labelNo: dto.labelNo,
        foodName: dto.foodName,
        foodType: dto.foodType,
        imageUrl: dto.imageUrl,
        ocrStatus: 'pending',
        uploadUserId: 1,
      },
    });
  }

  async findAll(filter?: { status?: string; foodType?: string }) {
    return this.prisma.label.findMany({
      where: {
        ...(filter?.status && { ocrStatus: filter.status }),
        ...(filter?.foodType && { foodType: filter.foodType }),
      },
      include: { uploadUser: { select: { id: true, realName: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const label = await this.prisma.label.findUnique({
      where: { id },
      include: {
        uploadUser: { select: { id: true, realName: true } },
        review: { include: { items: true } },
      },
    });
    if (!label) throw new NotFoundException('标签不存在');
    return label;
  }

  async triggerOcr(id: number) {
    const label = await this.prisma.label.update({
      where: { id },
      data: { ocrStatus: 'processing' },
    });
    // 异步执行 OCR（模拟）
    setTimeout(() => this.simulateOcr(id), 2000);
    return { message: 'OCR任务已启动', labelId: id };
  }

  async getOcrResult(id: number) {
    const label = await this.prisma.label.findUnique({ where: { id } });
    if (!label) throw new NotFoundException('标签不存在');
    if (label.ocrStatus === 'processing') {
      return { status: 'processing', message: 'OCR进行中，请稍后重试' };
    }
    return { status: label.ocrStatus, ocrText: label.ocrText };
  }

  private async simulateOcr(id: number) {
    const sampleData = this.getSampleOcrData(id);
    await this.prisma.label.update({
      where: { id },
      data: { ocrText: JSON.stringify(sampleData), ocrStatus: 'done' },
    });
  }

  private getSampleOcrData(labelId: number) {
    return {
      foodName: '有机纯牛奶',
      brand: '蒙牛乳业',
      netContent: '250mL',
      ingredients: '生牛乳',
      productionDate: '2024-01-15',
      expiryDate: '见瓶身',
      storageCondition: '常温保存，避免阳光直射',
      manufacturer: '内蒙古蒙牛乳业（集团）股份有限公司',
      address: '内蒙古呼和浩特市和林格尔县盛乐经济园区',
      scCode: 'SC105150105123456',
      nutritionFacts: {
        energy: '276kJ',
        protein: '3.0g',
        fat: '3.4g',
        carbohydrate: '4.5g',
        sodium: '50mg',
        nrvs: { energy: '3%', protein: '5%', fat: '6%', carbohydrate: '2%', sodium: '3%' },
      },
      allergens: '乳',
      origin: '中国',
    };
  }
}