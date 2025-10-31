import { SetMetadata } from '@nestjs/common';

/**
 * 角色装饰器
 * 用于标记需要特定角色才能访问的路由或方法
 * 
 * @example
 * @Roles('ADMIN', 'MASTER')
 * @Get('admin-only')
 * adminOnlyMethod() {
 *   // 只有ADMIN或MASTER角色的用户才能访问
 * }
 */
export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);