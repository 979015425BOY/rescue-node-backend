import { SetMetadata } from '@nestjs/common';

/**
 * 权限装饰器
 * 用于标记需要特定权限才能访问的路由或方法
 * 
 * @example
 * @Permissions('user:manage', 'rescue:create')
 * @Get('admin-users')
 * manageUsers() {
 *   // 只有拥有user:manage或rescue:create权限的用户才能访问
 * }
 */
export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (...permissions: string[]) => SetMetadata(PERMISSIONS_KEY, permissions);