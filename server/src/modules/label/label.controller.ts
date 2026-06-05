import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Query,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LabelService } from './label.service';

const storage = diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${uuidv4()}${extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

@Controller('labels')
@UseGuards(JwtAuthGuard)
export class LabelController {
  constructor(private readonly labelService: LabelService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('image', { storage }))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { foodType: string; labelNo?: string },
  ) {
    return this.labelService.createLabel({
      labelNo: body.labelNo || `LB${Date.now()}`,
      foodType: body.foodType,
      imageUrl: `/uploads/${file.filename}`,
    });
  }

  @Get()
  async findAll(
    @Query('status') status?: string,
    @Query('foodType') foodType?: string,
  ) {
    return this.labelService.findAll({ status, foodType });
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.labelService.findOne(id);
  }

  @Post(':id/ocr')
  async triggerOcr(@Param('id', ParseIntPipe) id: number) {
    return this.labelService.triggerOcr(id);
  }

  @Get(':id/ocr/result')
  async getOcrResult(@Param('id', ParseIntPipe) id: number) {
    return this.labelService.getOcrResult(id);
  }
}