import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../../entities/role.entity';
import { UserRole } from '../../entities/user-role.entity';

/**
 * 角色服务类
 * 提供角色管理的核心业务逻辑
 */
@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
  ) {}

  /**
   * 创建角色
   * @param roleData 角色数据
   * @returns 创建的角色
   */
  async create(roleData: Partial<Role>): Promise<Role> {
    // 检查角色编码是否已存在
    const existingRole = await this.roleRepository.findOne({
      where: { code: roleData.code }
    });

    if (existingRole) {
      throw new ConflictException(`角色编码 ${roleData.code} 已存在`);
    }

    const role = this.roleRepository.create(roleData);
    return await this.roleRepository.save(role);
  }

  /**
   * 获取所有角色
   * @returns 角色列表
   */
  async findAll(): Promise<Role[]> {
    return await this.roleRepository.find({
      where: { isActive: true },
      order: { createdAt: 'ASC' }
    });
  }

  /**
   * 根据ID获取角色
   * @param id 角色ID
   * @returns 角色信息
   */
  async findOne(id: string): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id }
    });

    if (!role) {
      throw new NotFoundException(`角色 ${id} 不存在`);
    }

    return role;
  }

  /**
   * 根据编码获取角色
   * @param code 角色编码
   * @returns 角色信息
   */
  async findByCode(code: string): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { code }
    });

    if (!role) {
      throw new NotFoundException(`角色编码 ${code} 不存在`);
    }

    return role;
  }

  /**
   * 更新角色
   * @param id 角色ID
   * @param updateData 更新数据
   * @returns 更新后的角色
   */
  async update(id: string, updateData: Partial<Role>): Promise<Role> {
    const role = await this.findOne(id);

    // 如果更新角色编码，检查是否冲突
    if (updateData.code && updateData.code !== role.code) {
      const existingRole = await this.roleRepository.findOne({
        where: { code: updateData.code }
      });

      if (existingRole) {
        throw new ConflictException(`角色编码 ${updateData.code} 已存在`);
      }
    }

    Object.assign(role, updateData);
    return await this.roleRepository.save(role);
  }

  /**
   * 删除角色（软删除）
   * @param id 角色ID
   */
  async remove(id: string): Promise<void> {
    const role = await this.findOne(id);
    role.isActive = false;
    await this.roleRepository.save(role);
  }

  /**
   * 为用户分配角色
   * @param userId 用户ID
   * @param roleId 角色ID
   * @param assignedBy 分配人ID
   * @returns 用户角色关联记录
   */
  async assignRoleToUser(userId: string, roleId: string, assignedBy?: string): Promise<UserRole> {
    // 检查是否已经分配过该角色
    const existingUserRole = await this.userRoleRepository.findOne({
      where: { userId, roleId }
    });

    if (existingUserRole) {
      throw new ConflictException('用户已拥有该角色');
    }

    const userRole = this.userRoleRepository.create({
      userId,
      roleId,
      assignedBy
    });

    return await this.userRoleRepository.save(userRole);
  }

  /**
   * 移除用户角色
   * @param userId 用户ID
   * @param roleId 角色ID
   */
  async removeRoleFromUser(userId: string, roleId: string): Promise<void> {
    const userRole = await this.userRoleRepository.findOne({
      where: { userId, roleId }
    });

    if (!userRole) {
      throw new NotFoundException('用户角色关联不存在');
    }

    await this.userRoleRepository.remove(userRole);
  }

  /**
   * 获取用户的所有角色
   * @param userId 用户ID
   * @returns 用户角色列表
   */
  async getUserRoles(userId: string): Promise<Role[]> {
    const userRoles = await this.userRoleRepository.find({
      where: { userId },
      relations: ['role']
    });

    return userRoles.map(ur => ur.role);
  }

  /**
   * 批量为用户分配角色
   * @param userId 用户ID
   * @param roleCodes 角色编码数组
   * @param assignedBy 分配人ID
   */
  async assignRolesToUser(userId: string, roleCodes: string[], assignedBy?: string): Promise<void> {
    for (const roleCode of roleCodes) {
      const role = await this.findByCode(roleCode);
      
      // 检查是否已经分配过该角色
      const existingUserRole = await this.userRoleRepository.findOne({
        where: { userId, roleId: role.id }
      });

      if (!existingUserRole) {
        await this.assignRoleToUser(userId, role.id, assignedBy);
      }
    }
  }
}