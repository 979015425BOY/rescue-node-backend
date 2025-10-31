import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { UserRole } from './user-role.entity';

/**
 * 角色实体类
 * 用于定义系统角色和权限管理
 * 支持多种角色：普通用户、救援师傅、管理员等
 */
@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, unique: true, comment: '角色名称' })
  name: string;

  @Column({ length: 20, unique: true, comment: '角色编码' })
  code: string;

  @Column({ type: 'text', nullable: true, comment: '角色描述' })
  description: string;

  @Column({ 
    type: 'json', 
    nullable: true, 
    comment: '权限列表，JSON格式存储权限数组' 
  })
  permissions: string[];

  @Column({ default: true, name: 'is_active', comment: '是否激活' })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: '更新时间' })
  updatedAt: Date;

  // 与用户的多对多关系
  @ManyToMany(() => User, user => user.roles)
  users: User[];

  // 用户角色关联记录
  @OneToMany(() => UserRole, userRole => userRole.role)
  userRoles: UserRole[];

  /**
   * 检查角色是否拥有指定权限
   * @param permission 权限名称
   * @returns 是否拥有权限
   */
  hasPermission(permission: string): boolean {
    return this.permissions && this.permissions.includes(permission);
  }

  /**
   * 添加权限
   * @param permission 权限名称
   */
  addPermission(permission: string): void {
    if (!this.permissions) {
      this.permissions = [];
    }
    if (!this.permissions.includes(permission)) {
      this.permissions.push(permission);
    }
  }

  /**
   * 移除权限
   * @param permission 权限名称
   */
  removePermission(permission: string): void {
    if (this.permissions) {
      this.permissions = this.permissions.filter(p => p !== permission);
    }
  }
}