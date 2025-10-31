// 调试认证问题脚本
const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./dist/app.module');
const bcrypt = require('bcrypt');

async function debugAuth() {
  try {
    console.log('正在启动应用上下文...');
    const app = await NestFactory.createApplicationContext(AppModule);
    
    // 获取用户仓库
    const userRepository = app.get('UserRepository');
    
    // 查找用户
    const user = await userRepository.findOne({ where: { phone: '13800138000' } });
    
    if (user) {
      console.log('找到用户:', {
        id: user.id,
        phone: user.phone,
        username: user.username,
        passwordHash: user.password,
        isActive: user.isActive,
        createdAt: user.createdAt
      });
      
      // 检查密码字段是否为空或undefined
      console.log('密码字段详情:');
      console.log('- user.password:', user.password);
      console.log('- typeof user.password:', typeof user.password);
      console.log('- user.password length:', user.password ? user.password.length : 'N/A');
      
      // 测试密码验证
      const testPassword = 'password123';
      console.log(`\n测试密码: "${testPassword}"`);
      
      try {
        const isValid = await bcrypt.compare(testPassword, user.password);
        console.log('bcrypt.compare 结果:', isValid);
        
        // 手动生成相同密码的哈希来对比
        const newHash = await bcrypt.hash(testPassword, 10);
        console.log('新生成的哈希:', newHash);
        
        const isNewHashValid = await bcrypt.compare(testPassword, newHash);
        console.log('新哈希验证结果:', isNewHashValid);
        
      } catch (error) {
        console.error('密码验证过程中出错:', error);
      }
      
    } else {
      console.log('未找到手机号为 13800138000 的用户');
      
      // 列出所有用户
      const allUsers = await userRepository.find();
      console.log('数据库中的所有用户:');
      allUsers.forEach(u => {
        console.log(`- ID: ${u.id}, 手机号: ${u.phone}, 用户名: ${u.username}`);
      });
    }
    
    await app.close();
  } catch (error) {
    console.error('调试失败:', error);
    console.error('错误详情:', error.message);
    process.exit(1);
  }
}

debugAuth();