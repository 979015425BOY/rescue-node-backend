/**
 * 为默认用户分配角色脚本
 * 为普通用户分配USER角色，为师傅用户分配MASTER角色
 */

const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('../dist/app.module');
const { getRepositoryToken } = require('@nestjs/typeorm');
const { User } = require('../dist/entities/user.entity');
const { Role } = require('../dist/entities/role.entity');
const { UserRole } = require('../dist/entities/user-role.entity');

async function assignDefaultUserRoles() {
  console.log('开始为默认用户分配角色...');

  try {
    // 创建应用实例
    const app = await NestFactory.createApplicationContext(AppModule);
    const userRepository = app.get(getRepositoryToken(User));
    const roleRepository = app.get(getRepositoryToken(Role));
    const userRoleRepository = app.get(getRepositoryToken(UserRole));

    // 获取角色
    const userRole = await roleRepository.findOne({ where: { code: 'USER' } });
    const masterRole = await roleRepository.findOne({ where: { code: 'MASTER' } });

    if (!userRole || !masterRole) {
      console.error('角色不存在，请先运行角色初始化脚本');
      process.exit(1);
    }

    // 定义用户角色映射
    const userRoleMappings = [
      {
        username: 'normaluser',
        phone: '13800138001',
        roleCode: 'USER',
        role: userRole,
        description: '普通用户角色'
      },
      {
        username: 'masteruser', 
        phone: '13800138002',
        roleCode: 'MASTER',
        role: masterRole,
        description: '救援师傅角色'
      }
    ];

    // 为每个用户分配角色
    for (const mapping of userRoleMappings) {
      // 查找用户
      const user = await userRepository.findOne({
        where: { username: mapping.username }
      });

      if (!user) {
        console.log(`⚠️  用户 ${mapping.username} 不存在，跳过角色分配`);
        continue;
      }

      // 检查是否已经分配过该角色
      const existingUserRole = await userRoleRepository.findOne({
        where: { 
          userId: user.id, 
          roleId: mapping.role.id 
        }
      });

      if (existingUserRole) {
        console.log(`角色已存在: ${mapping.username} 已拥有 ${mapping.roleCode} 角色`);
        continue;
      }

      // 创建用户角色关联
      const userRole = userRoleRepository.create({
        userId: user.id,
        roleId: mapping.role.id,
        assignedBy: null // 系统分配
      });

      await userRoleRepository.save(userRole);
      console.log(`✓ 成功为用户 ${mapping.username} (${mapping.phone}) 分配 ${mapping.description}`);
    }

    // 验证角色分配结果
    console.log('\n验证角色分配结果:');
    for (const mapping of userRoleMappings) {
      const user = await userRepository.findOne({
        where: { username: mapping.username },
        relations: ['roles']
      });

      if (user) {
        const userRoles = await userRoleRepository.find({
          where: { userId: user.id },
          relations: ['role']
        });

        console.log(`\n用户: ${user.username} (${user.phone})`);
        console.log(`昵称: ${user.nickname}`);
        console.log(`角色: ${userRoles.map(ur => `${ur.role.name} (${ur.role.code})`).join(', ')}`);
        console.log(`权限: ${userRoles.flatMap(ur => ur.role.permissions).join(', ')}`);
      }
    }

    // 统计信息
    const totalUserRoles = await userRoleRepository.count();
    console.log(`\n角色分配完成！当前共有 ${totalUserRoles} 个用户角色关联记录。`);

    await app.close();
  } catch (error) {
    console.error('分配用户角色时发生错误:', error);
    process.exit(1);
  }
}

// 运行脚本
if (require.main === module) {
  assignDefaultUserRoles();
}

module.exports = { assignDefaultUserRoles };