import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Role } from './role.entity';
import { UserRole } from './user-role.entity';

/**
 * 用户实体类
 * 用于定义用户表结构和字段映射
 * 支持多角色权限管理
 */
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 11, comment: '手机号码' })
  phone: string;

  @Column({ length: 50, comment: '用户名' })
  username: string;

  @Column({ unique: true, length: 100, nullable: true, comment: '邮箱' })
  email: string;

  @Column({ length: 255, name: 'password_hash', comment: '密码哈希' })
  password: string;

  @Column({ length: 100, nullable: true, comment: '昵称' })
  nickname: string;

  @Column({ type: 'text', nullable: true, comment: '头像URL' })
  avatar: string;

  @Column({ length: 50, nullable: true, name: 'real_name', comment: '真实姓名' })
  realName: string;

  @Column({ length: 18, nullable: true, name: 'id_card', comment: '身份证号' })
  idCard: string;

  @Column({ length: 50, nullable: true, name: 'emergency_contact', comment: '紧急联系人' })
  emergencyContact: string;

  @Column({ length: 11, nullable: true, name: 'emergency_phone', comment: '紧急联系电话' })
  emergencyPhone: string;

  @Column({ type: 'text', nullable: true, comment: '地址' })
  address: string;

  @Column({ type: 'int', default: 0, comment: '积分' })
  points: number;

  @Column({ length: 20, default: '普通用户', comment: '用户等级' })
  level: string;

  @Column({ default: true, name: 'is_active', comment: '是否激活' })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: '更新时间' })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'last_login_time', comment: '最后登录时间' })
  lastLoginTime: Date;

  // 与角色的多对多关系
  @ManyToMany(() => Role, role => role.users)
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' }
  })
  roles: Role[];

  // 用户角色关联记录
  @OneToMany(() => UserRole, userRole => userRole.user)
  userRoles: UserRole[];

  /**
   * 获取用户所有角色编码
   * @returns 角色编码数组
   */
  getRoleCodes(): string[] {
    return this.roles ? this.roles.map(role => role.code) : [];
  }

  /**
   * 获取用户所有权限
   * @returns 权限数组
   */
  getPermissions(): string[] {
    if (!this.roles) return [];
    
    const permissions = new Set<string>();
    this.roles.forEach(role => {
      if (role.permissions) {
        role.permissions.forEach(permission => permissions.add(permission));
      }
    });
    
    return Array.from(permissions);
  }

  /**
   * 检查用户是否拥有指定角色
   * @param roleCode 角色编码
   * @returns 是否拥有角色
   */
  hasRole(roleCode: string): boolean {
    return this.getRoleCodes().includes(roleCode);
  }

  /**
   * 检查用户是否拥有指定权限
   * @param permission 权限名称
   * @returns 是否拥有权限
   */
  hasPermission(permission: string): boolean {
    return this.getPermissions().includes(permission);
  }

  /**
   * 检查用户是否拥有任一指定角色
   * @param roleCodes 角色编码数组
   * @returns 是否拥有任一角色
   */
  hasAnyRole(roleCodes: string[]): boolean {
    const userRoles = this.getRoleCodes();
    return roleCodes.some(roleCode => userRoles.includes(roleCode));
  }

  /**
   * 检查用户是否拥有所有指定角色
   * @param roleCodes 角色编码数组
   * @returns 是否拥有所有角色
   */
  hasAllRoles(roleCodes: string[]): boolean {
    const userRoles = this.getRoleCodes();
    return roleCodes.every(roleCode => userRoles.includes(roleCode));
  }
}