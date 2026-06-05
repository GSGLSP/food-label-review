import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { LabelModule } from './modules/label/label.module';
import { ReviewModule } from './modules/review/review.module';
import { RegulationModule } from './modules/regulation/regulation.module';
import { ReportModule } from './modules/report/report.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET', 'food-label-review-secret-2024'),
        signOptions: { expiresIn: '7d' },
      }),
    }),
    PrismaModule,
    UserModule,
    AuthModule,
    LabelModule,
    ReviewModule,
    RegulationModule,
    ReportModule,
  ],
})
export class AppModule {}