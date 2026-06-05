import { Controller, Get, Post, Put, Body, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ReviewService } from './review.service';

@Controller('reviews')
@UseGuards(JwtAuthGuard)
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  async create(@Body() body: { labelId: number; reviewerId?: number }) {
    return this.reviewService.createReview(body.labelId, body.reviewerId || 1);
  }

  @Get()
  async findAll(@Query('status') status?: string, @Query('foodType') foodType?: string) {
    return this.reviewService.findAll({ status, foodType });
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reviewService.findOne(id);
  }

  @Put(':id/items/:itemId')
  async updateItem(
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() body: { result: string; issue?: string; suggestion?: string },
  ) {
    return this.reviewService.updateItem(itemId, body);
  }

  @Put(':id/submit')
  async submitReview(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { overallResult: string },
  ) {
    return this.reviewService.submitReview(id, body.overallResult);
  }
}