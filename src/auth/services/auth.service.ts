import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../entities/user.entity';
import { RefreshToken } from '../../entities/refresh-token.entity';
import { UserRole } from '../../entities/user-role.entity';
import { SmsService } from './sms.service';
import { LoginDto } from '../../dto/auth/login.dto';
import { RegisterDto } from '../../dto/auth/register.dto';
import { ResetPasswordDto } from '../../dto/auth/reset-password.dto';

/**
 * 认证服务
 * 用于处理用户认证相关业务逻辑
 */
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
    private jwtService: JwtService,
    private smsService: SmsService,
  ) {}

  /**
   * 用户登录
   * @param loginDto 登录信息
   * @returns 登录结果
   */
  async login(loginDto: LoginDto) {
    const { phone, password } = loginDto;

    try {
      console.log('用户登录尝试:', { phone });

      // 查找用户
      const user = await this.userRepository.findOne({ where: { phone } });
      if (!user) {
        console.log('用户不存在:', { phone });
        throw new UnauthorizedException('手机号或密码错误');
      }

      console.log('找到用户:', { 
        id: user.id, 
        username: user.username, 
        phone: user.phone,
        isActive: user.isActive 
      });

      // 验证密码
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        console.log('密码验证失败:', { phone });
        throw new UnauthorizedException('手机号或密码错误');
      }

      // 检查用户是否激活
      if (!user.isActive) {
        console.log('用户账户已禁用:', { phone });
        throw new UnauthorizedException('账户已被禁用');
      }

      // 更新最后登录时间
      user.lastLoginTime = new Date();
      await this.userRepository.save(user);

      console.log('开始生成令牌:', { userId: user.id });

      // 生成令牌
      const tokens = await this.generateTokens(user);

      console.log('令牌生成成功:', { 
        userId: user.id,
        hasAccessToken: !!tokens.accessToken,
        hasRefreshToken: !!tokens.refreshToken,
        userRoles: tokens.user.roles,
        userPermissions: tokens.user.permissions
      });

      return tokens;
    } catch (error) {
      console.error('登录过程中发生错误:', {
        phone,
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  /**
   * 用户注册
   * @param registerDto 注册信息
   * @returns 注册结果
   */
  async register(registerDto: RegisterDto) {
    const { phone, username, password, smsCode } = registerDto;

    // 验证短信验证码
    await this.smsService.verifySmsCode(phone, smsCode, 'register');

    // 检查手机号是否已存在
    const existingUserByPhone = await this.userRepository.findOne({ where: { phone } });
    if (existingUserByPhone) {
      throw new ConflictException('手机号已被注册');
    }

    // 检查用户名是否已存在
    const existingUserByUsername = await this.userRepository.findOne({ where: { username } });
    if (existingUserByUsername) {
      throw new ConflictException('用户名已被使用');
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const user = this.userRepository.create({
      phone,
      username,
      password: hashedPassword,
      isActive: true,
    });

    const savedUser = await this.userRepository.save(user);

    // 生成令牌
    const tokens = await this.generateTokens(savedUser);

    return tokens;
  }

  /**
   * 重置密码
   * @param resetPasswordDto 重置密码信息
   * @returns 重置结果
   */
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { phone, newPassword, smsCode } = resetPasswordDto;

    // 验证短信验证码
    await this.smsService.verifySmsCode(phone, smsCode, 'reset_password');

    // 查找用户
    const user = await this.userRepository.findOne({ where: { phone } });
    if (!user) {
      throw new BadRequestException('用户不存在');
    }

    // 加密新密码
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 更新密码
    user.password = hashedPassword;
    await this.userRepository.save(user);

    // 撤销所有刷新令牌
    await this.refreshTokenRepository.update(
      { userId: user.id },
      { isRevoked: true }
    );

    return {
      success: true,
      message: '密码重置成功',
    };
  }

  /**
   * 刷新访问令牌
   * @param refreshToken 刷新令牌
   * @returns 新的令牌
   */
  async refreshAccessToken(refreshToken: string) {
    // 查找刷新令牌
    const tokenRecord = await this.refreshTokenRepository.findOne({
      where: { token: refreshToken, isRevoked: false },
      relations: ['user'],
    });

    if (!tokenRecord) {
      throw new UnauthorizedException('刷新令牌无效');
    }

    // 检查是否过期
    if (tokenRecord.expiresAt < new Date()) {
      throw new UnauthorizedException('刷新令牌已过期');
    }

    // 生成新的访问令牌
    const payload = { sub: tokenRecord.user.id, phone: tokenRecord.user.phone };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '2h' });

    return {
      accessToken,
      expiresIn: 7200, // 2小时
    };
  }

  /**
   * 登出
   * @param userId 用户ID
   * @param refreshToken 刷新令牌
   */
  async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      // 撤销指定的刷新令牌
      await this.refreshTokenRepository.update(
        { token: refreshToken, userId },
        { isRevoked: true }
      );
    } else {
      // 撤销用户的所有刷新令牌
      await this.refreshTokenRepository.update(
        { userId },
        { isRevoked: true }
      );
    }

    return {
      success: true,
      message: '登出成功',
    };
  }

  /**
   * 生成访问令牌和刷新令牌
   * @param user 用户信息
   * @returns 令牌对象
   */
  private async generateTokens(user: User) {
    try {
      // 获取用户的角色信息
      const userRoles = await this.userRoleRepository.find({
        where: { userId: user.id },
        relations: ['role']
      });

      // 提取角色编码和权限，如果没有角色则使用空数组
      const roles = userRoles?.map(ur => ur.role?.code).filter(Boolean) || [];
      const permissions = new Set<string>();
      
      if (userRoles && userRoles.length > 0) {
        userRoles.forEach(ur => {
          if (ur.role && ur.role.permissions && Array.isArray(ur.role.permissions)) {
            ur.role.permissions.forEach(permission => {
              if (permission) {
                permissions.add(permission);
              }
            });
          }
        });
      }

      const payload = { 
        sub: user.id, 
        phone: user.phone,
        username: user.username,
        nickname: user.nickname,
        roles: roles,
        permissions: Array.from(permissions)
      };

      // 生成访问令牌（2小时）
      const accessToken = this.jwtService.sign(payload, { expiresIn: '2h' });

      // 生成刷新令牌（7天）
      const refreshTokenValue = this.jwtService.sign(
        { sub: user.id, phone: user.phone }, 
        { expiresIn: '7d' }
      );

      // 保存刷新令牌到数据库
      const refreshToken = this.refreshTokenRepository.create({
        token: refreshTokenValue,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7天
      });

      await this.refreshTokenRepository.save(refreshToken);

      return {
        accessToken,
        refreshToken: refreshTokenValue,
        expiresIn: 7200, // 2小时
        user: {
          id: user.id,
          phone: user.phone,
          username: user.username,
          nickname: user.nickname,
          roles: roles,
          permissions: Array.from(permissions)
        }
      };
    } catch (error) {
      // 如果角色查询失败，记录详细错误信息但仍然生成基本令牌
      console.error('获取用户角色信息失败:', {
        userId: user.id,
        username: user.username,
        phone: user.phone,
        error: error.message,
        stack: error.stack
      });
      
      // 生成不包含角色信息的基本令牌
      const basicPayload = { 
        sub: user.id, 
        phone: user.phone,
        username: user.username,
        nickname: user.nickname,
        roles: [],
        permissions: []
      };

      const accessToken = this.jwtService.sign(basicPayload, { expiresIn: '2h' });
      const refreshTokenValue = this.jwtService.sign(
        { sub: user.id, phone: user.phone }, 
        { expiresIn: '7d' }
      );

      // 保存刷新令牌到数据库
      const refreshToken = this.refreshTokenRepository.create({
        token: refreshTokenValue,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7天
      });

      await this.refreshTokenRepository.save(refreshToken);

      return {
        accessToken,
        refreshToken: refreshTokenValue,
        expiresIn: 7200, // 2小时
        user: {
          id: user.id,
          phone: user.phone,
          username: user.username,
          nickname: user.nickname,
          roles: [],
          permissions: []
        }
      };
    }
  }
}