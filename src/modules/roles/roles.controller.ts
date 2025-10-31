import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { Role } from '../../entities/role.entity';

/**
 * 角色管理控制器
 * 提供角色管理的HTTP接口
 */
@ApiTags('角色管理')
@Controller('roles')
@ApiBearerAuth()
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  /**
   * 获取所有角色
   */
  @Get()
  @ApiOperation({ summary: '获取所有角色' })
  @ApiResponse({ status: 200, description: '获取成功', type: [Role] })
  async findAll(): Promise<Role[]> {
    return await this.rolesService.findAll();
  }

  /**
   * 根据ID获取角色
   */
  @Get(':id')
  @ApiOperation({ summary: '根据ID获取角色' })
  @ApiResponse({ status: 200, description: '获取成功', type: Role })
  @ApiResponse({ status: 404, description: '角色不存在' })
  async findOne(@Param('id') id: string): Promise<Role> {
    return await this.rolesService.findOne(id);
  }

  /**
   * 获取用户角色
   */
  @Get('user/:userId')
  @ApiOperation({ summary: '获取用户的所有角色' })
  @ApiResponse({ status: 200, description: '获取成功', type: [Role] })
  async getUserRoles(@Param('userId') userId: string): Promise<Role[]> {
    return await this.rolesService.getUserRoles(userId);
  }
}