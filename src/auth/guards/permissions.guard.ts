import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { UserRole } from '../../entities/user-role.entity';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

/**
 * 权限守卫
 * 检查用户是否拥有访问特定资源所需的权限
 * 
 * 使用方法：
 * 1. 在控制器或方法上使用 @Permissions('user:manage', 'rescue:create') 装饰器
 * 2. 守卫会自动检查当前用户是否拥有指定权限之一
 * 3. 如果用户拥有任一指定权限，则允许访问；否则拒绝访问
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 获取路由或方法上设置的权限要求
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 如果没有设置权限要求，则允许访问
    if (!requiredPermissions) {
      return true;
    }

    // 获取请求对象和用户信息
    const { user } = context.switchToHttp().getRequest();
    
    // 如果用户未登录，拒绝访问
    if (!user) {
      return false;
    }

    try {
      // 获取用户的所有角色及其权限
      const userRoles = await this.userRoleRepository.find({
        where: { userId: user.id },
        relations: ['role']
      });

      // 收集用户的所有权限
      const userPermissions = new Set<string>();
      userRoles.forEach(ur => {
        if (ur.role.permissions) {
          ur.role.permissions.forEach(permission => {
            userPermissions.add(permission);
          });
        }
      });

      // 检查用户是否拥有任一所需权限
      const hasRequiredPermission = requiredPermissions.some(permission => {
        // 支持通配符权限（如 admin:*）
        if (userPermissions.has('admin:*')) {
          return true;
        }
        return userPermissions.has(permission);
      });

      return hasRequiredPermission;
    } catch (error) {
      console.error('权限验证时发生错误:', error);
      return false;
    }
  }
}