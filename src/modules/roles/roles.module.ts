import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Role } from '../../entities/role.entity';
import { UserRole } from '../../entities/user-role.entity';

/**
 * 角色管理模块
 * 提供角色和权限管理功能
 */
@Module({
  imports: [TypeOrmModule.forFeature([Role, UserRole])],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}