import { IsString, IsEmail, MinLength, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: '用户名' })
  @IsString()
  username: string;

  @ApiProperty({ description: '密码' })
  @IsString()
  @MinLength(6)
  password: string;
}

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

  @ApiProperty({ description: '角色', enum: ['admin', 'reviewer', 'viewer'] })
  @IsEnum(['admin', 'reviewer', 'viewer'])
  role: string;
}

export class UpdateUserDto {
  @ApiProperty({ description: '真实姓名', required: false })
  @IsString()
  realName?: string;

  @ApiProperty({ description: '密码', required: false })
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiProperty({ description: '角色', enum: ['admin', 'reviewer', 'viewer'], required: false })
  @IsEnum(['admin', 'reviewer', 'viewer'])
  role?: string;

  @ApiProperty({ description: '状态', required: false })
  status?: number;
}
