import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { UserRole } from '../../entities/user-role.entity';
import { ROLES_KEY } from '../decorators/roles.decorator';

/**
 * 角色守卫
 * 检查用户是否拥有访问特定资源所需的角色
 * 
 * 使用方法：
 * 1. 在控制器或方法上使用 @Roles('ADMIN', 'MASTER') 装饰器
 * 2. 守卫会自动检查当前用户是否拥有指定角色之一
 * 3. 如果用户拥有任一指定角色，则允许访问；否则拒绝访问
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 获取路由或方法上设置的角色要求
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 如果没有设置角色要求，则允许访问
    if (!requiredRoles) {
      return true;
    }

    // 获取请求对象和用户信息
    const { user } = context.switchToHttp().getRequest();
    
    // 如果用户未登录，拒绝访问
    if (!user) {
      return false;
    }

    try {
      // 获取用户的所有角色
      const userRoles = await this.userRoleRepository.find({
        where: { userId: user.id },
        relations: ['role']
      });

      // 提取用户的角色编码
      const userRoleCodes = userRoles.map(ur => ur.role.code);

      // 检查用户是否拥有任一所需角色
      const hasRequiredRole = requiredRoles.some(role => userRoleCodes.includes(role));

      return hasRequiredRole;
    } catch (error) {
      console.error('角色验证时发生错误:', error);
      return false;
    }
  }
}