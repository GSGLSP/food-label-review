import { IsString, IsEmail, MinLength, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: '用户名' })
  @IsString()
  username: string;

  @ApiProperty({ description: '密码' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: '真实姓名' })
  @IsString()
  realName: string;

  @ApiProperty({ description: '角色', enum: ['admin', 'reviewer', 'viewer'], required: false })
  @IsEnum(['admin', 'reviewer', 'viewer'])
  @IsOptional()
  role?: string;
}

export class UpdateUserDto {
  @ApiProperty({ description: '真实姓名', required: false })
  @IsString()
  @IsOptional()
  realName?: string;

  @ApiProperty({ description: '密码', required: false })
  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @ApiProperty({ description: '角色', enum: ['admin', 'reviewer', 'viewer'], required: false })
  @IsEnum(['admin', 'reviewer', 'viewer'])
  @IsOptional()
  role?: string;

  @ApiProperty({ description: '状态', required: false })
  @IsOptional()
  status?: number;
}
