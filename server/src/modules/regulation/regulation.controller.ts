import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RegulationService } from './regulation.service';

@Controller('regulations')
@UseGuards(JwtAuthGuard)
export class RegulationController {
  constructor(private readonly regulationService: RegulationService) {}

  @Get()
  async findAll(@Query('category') category?: string, @Query('foodType') foodType?: string) {
    return this.regulationService.findAll({ category, foodType });
  }

  @Post('seed')
  async seed() {
    return this.regulationService.seed();
  }
}