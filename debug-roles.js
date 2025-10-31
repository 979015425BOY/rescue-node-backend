const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./dist/app.module');
const { getRepositoryToken } = require('@nestjs/typeorm');
const { User } = require('./dist/entities/user.entity');
const { Role } = require('./dist/entities/role.entity');
const { UserRole } = require('./dist/entities/user-role.entity');

async function debugRoles() {
  console.log('🔍 开始检查角色数据和用户角色关联...');
  
  try {
    const app = await NestFactory.createApplicationContext(AppModule);
    
    // 获取仓库
    const userRepository = app.get(getRepositoryToken(User));
    const roleRepository = app.get(getRepositoryToken(Role));
    const userRoleRepository = app.get(getRepositoryToken(UserRole));
    
    console.log('\n📋 检查角色数据:');
    const roles = await roleRepository.find();
    console.log(`找到 ${roles.length} 个角色:`);
    roles.forEach(role => {
      console.log(`- ID: ${role.id}, 编码: ${role.code}, 名称: ${role.name}`);
      console.log(`  权限: ${JSON.stringify(role.permissions)}`);
    });
    
    console.log('\n👥 检查用户数据:');
    const users = await userRepository.find();
    console.log(`找到 ${users.length} 个用户:`);
    users.forEach(user => {
      console.log(`- ID: ${user.id}, 手机: ${user.phone}, 用户名: ${user.username}`);
    });
    
    console.log('\n🔗 检查用户角色关联数据:');
    const userRoles = await userRoleRepository.find({
      relations: ['user', 'role']
    });
    console.log(`找到 ${userRoles.length} 个用户角色关联:`);
    userRoles.forEach(ur => {
      console.log(`- 用户: ${ur.user.phone} (${ur.user.username}) -> 角色: ${ur.role.code} (${ur.role.name})`);
    });
    
    console.log('\n🎯 检查特定用户的角色:');
    const targetUsers = ['13800138001', '13800138002'];
    
    for (const phone of targetUsers) {
      console.log(`\n检查用户 ${phone}:`);
      const user = await userRepository.findOne({ 
        where: { phone },
        relations: ['userRoles', 'userRoles.role']
      });
      
      if (user) {
        console.log(`- 用户ID: ${user.id}`);
        console.log(`- 用户名: ${user.username}`);
        console.log(`- 昵称: ${user.nickname}`);
        console.log(`- 角色数量: ${user.userRoles ? user.userRoles.length : 0}`);
        
        if (user.userRoles && user.userRoles.length > 0) {
          user.userRoles.forEach(ur => {
            console.log(`  - 角色: ${ur.role.code} (${ur.role.name})`);
            console.log(`    权限: ${JSON.stringify(ur.role.permissions)}`);
          });
        } else {
          console.log('  ❌ 没有分配任何角色!');
        }
      } else {
        console.log(`  ❌ 用户不存在!`);
      }
    }
    
    await app.close();
    console.log('\n✅ 角色数据检查完成');
    
  } catch (error) {
    console.error('❌ 检查角色数据时出错:', error.message);
    console.error(error.stack);
  }
}

debugRoles();