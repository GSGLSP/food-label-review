import { IsString, IsOptional } from 'class-validator';

export class CreateLabelDto {
  @IsString()
  labelNo: string;

  @IsString()
  @IsOptional()
  foodName?: string;

  @IsString()
  @IsOptional()
  foodType?: string;
}