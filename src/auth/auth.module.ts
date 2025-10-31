import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { SmsService } from './services/sms.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RolesGuard } from './guards/roles.guard';
import { PermissionsGuard } from './guards/permissions.guard';
import { User } from '../entities/user.entity';
import { SmsCode } from '../entities/sms-code.entity';
import { RefreshToken } from '../entities/refresh-token.entity';
import { Role } from '../entities/role.entity';
import { UserRole } from '../entities/user-role.entity';
import { UsersModule } from '../modules/users/users.module';

/**
 * 认证模块
 * 提供用户认证相关功能
 */
@Module({
  imports: [
    // 导入用户模块
    UsersModule,
    
    // 配置Passport
    PassportModule.register({ defaultStrategy: 'jwt' }),
    
    // 配置JWT
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'default-secret-key',
        signOptions: {
          expiresIn: '2h',
        },
      }),
      inject: [ConfigService],
    }),
    
    // 配置限流
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1分钟
        limit: 10, // 最多10次请求
      },
    ]),
    
    // 导入实体
    TypeOrmModule.forFeature([User, SmsCode, RefreshToken, Role, UserRole]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    SmsService,
    JwtStrategy,
    RolesGuard,
    PermissionsGuard,
  ],
  exports: [
    AuthService,
    SmsService,
    JwtStrategy,
    RolesGuard,
    PermissionsGuard,
  ],
})
export class AuthModule {}