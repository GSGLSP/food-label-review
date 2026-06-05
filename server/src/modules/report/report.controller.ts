import { Controller, Get, Post, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ReportService } from './report.service';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post('reviews/:reviewId/generate')
  async generate(@Param('reviewId', ParseIntPipe) reviewId: number) {
    return this.reportService.generateReport(reviewId);
  }

  @Get()
  async findAll() {
    return this.reportService.findAll();
  }

  @Get('reviews/:reviewId')
  async findOne(@Param('reviewId', ParseIntPipe) reviewId: number) {
    return this.reportService.findOne(reviewId);
  }
}