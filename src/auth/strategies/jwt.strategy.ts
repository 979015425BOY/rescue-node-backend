import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../modules/users/users.service';
import { JwtUser } from '../interfaces/jwt-user.interface';

/**
 * JWT认证策略
 * 用于验证JWT令牌的有效性
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'default-secret-key',
    });
  }

  /**
   * 验证JWT载荷
   * @param payload JWT载荷
   * @returns 用户信息
   */
  async validate(payload: any): Promise<JwtUser> {
    const { sub: userId, roles, permissions } = payload;
    
    // 根据用户ID查找用户
    const user = await this.usersService.findOne(userId);
    
    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('用户已被禁用');
    }

    // 返回用户信息，会被添加到request.user中
    return {
      id: user.id,
      phone: user.phone,
      username: user.username,
      email: user.email,
      nickname: user.nickname,
      roles: roles || [],
      permissions: permissions || []
    };
  }
}