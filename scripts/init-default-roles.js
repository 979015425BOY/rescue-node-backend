/**
 * 初始化默认角色数据脚本
 * 创建系统基础角色：普通用户、救援师傅、管理员
 */

const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('../dist/app.module');
const { getRepositoryToken } = require('@nestjs/typeorm');
const { Role } = require('../dist/entities/role.entity');

async function initDefaultRoles() {
  console.log('开始初始化默认角色数据...');

  try {
    // 创建应用实例
    const app = await NestFactory.createApplicationContext(AppModule);
    const roleRepository = app.get(getRepositoryToken(Role));

    // 定义默认角色数据
    const defaultRoles = [
      {
        name: '普通用户',
        code: 'USER',
        description: '系统普通用户，可以发起救援请求、查看救援信息',
        permissions: [
          'rescue:create',      // 创建救援请求
          'rescue:view',        // 查看救援信息
          'rescue:update_own',  // 更新自己的救援请求
          'profile:view',       // 查看个人资料
          'profile:update',     // 更新个人资料
        ],
        isActive: true,
      },
      {
        name: '救援师傅',
        code: 'MASTER',
        description: '救援服务提供者，可以接受和处理救援请求',
        permissions: [
          'rescue:view',        // 查看救援信息
          'rescue:accept',      // 接受救援请求
          'rescue:process',     // 处理救援请求
          'rescue:complete',    // 完成救援任务
          'rescue:cancel',      // 取消救援任务
          'profile:view',       // 查看个人资料
          'profile:update',     // 更新个人资料
          'master:dashboard',   // 师傅工作台
        ],
        isActive: true,
      },
      {
        name: '系统管理员',
        code: 'ADMIN',
        description: '系统管理员，拥有所有权限',
        permissions: [
          'admin:*',            // 管理员所有权限
          'user:manage',        // 用户管理
          'role:manage',        // 角色管理
          'rescue:manage',      // 救援管理
          'system:config',      // 系统配置
          'data:export',        // 数据导出
          'log:view',           // 日志查看
        ],
        isActive: true,
      },
    ];

    // 检查并创建角色
    for (const roleData of defaultRoles) {
      const existingRole = await roleRepository.findOne({
        where: { code: roleData.code }
      });

      if (existingRole) {
        console.log(`角色 ${roleData.name} (${roleData.code}) 已存在，跳过创建`);
        continue;
      }

      const role = roleRepository.create(roleData);
      await roleRepository.save(role);
      console.log(`✓ 成功创建角色: ${roleData.name} (${roleData.code})`);
    }

    // 显示所有角色
    const allRoles = await roleRepository.find();
    console.log('\n当前系统角色列表:');
    allRoles.forEach(role => {
      console.log(`- ${role.name} (${role.code}): ${role.description}`);
      console.log(`  权限: ${role.permissions.join(', ')}`);
      console.log(`  状态: ${role.isActive ? '激活' : '禁用'}`);
      console.log('');
    });

    console.log(`角色初始化完成！共有 ${allRoles.length} 个角色。`);

    await app.close();
  } catch (error) {
    console.error('初始化角色数据时发生错误:', error);
    process.exit(1);
  }
}

// 运行脚本
if (require.main === module) {
  initDefaultRoles();
}

module.exports = { initDefaultRoles };