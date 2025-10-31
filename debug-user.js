// 调试用户数据脚本
const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./dist/app.module');
const bcrypt = require('bcrypt');

async function debugUser() {
  try {
    console.log('正在启动应用...');
    const app = await NestFactory.createApplicationContext(AppModule);
    
    // 获取用户仓库
    const { getRepository } = require('typeorm');
    const { User } = require('./dist/entities/user.entity');
    
    // 查找用户
    const userRepository = app.get('UserRepository');
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
      
      // 测试密码验证
      const testPassword = 'password123';
      const isValid = await bcrypt.compare(testPassword, user.password);
      console.log(`密码 "${testPassword}" 验证结果:`, isValid);
      
      // 测试其他可能的密码
      const possiblePasswords = ['password123', '123456', 'admin', 'test'];
      for (const pwd of possiblePasswords) {
        const result = await bcrypt.compare(pwd, user.password);
        console.log(`密码 "${pwd}" 验证结果:`, result);
      }
    } else {
      console.log('未找到手机号为 13800138000 的用户');
    }
    
    await app.close();
  } catch (error) {
    console.error('调试失败:', error);
    console.error('错误详情:', error.message);
    process.exit(1);
  }
}

debugUser();