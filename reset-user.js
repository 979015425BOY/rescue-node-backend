// 重置用户脚本
const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./dist/app.module');

async function resetUser() {
  try {
    console.log('正在启动应用上下文...');
    const app = await NestFactory.createApplicationContext(AppModule);
    
    // 获取用户仓库
    const userRepository = app.get('UserRepository');
    
    // 获取刷新令牌仓库
    const refreshTokenRepository = app.get('RefreshTokenRepository');
    
    // 先查找用户
    const user = await userRepository.findOne({ where: { phone: '13800138000' } });
    if (user) {
      console.log('找到用户，正在删除相关数据...');
      
      // 先删除相关的刷新令牌
      const tokenResult = await refreshTokenRepository.delete({ userId: user.id });
      console.log('删除刷新令牌结果:', tokenResult);
      
      // 再删除用户
      const result = await userRepository.delete({ phone: '13800138000' });
      console.log('删除用户结果:', result);
    } else {
      console.log('未找到用户');
    }
    
    await app.close();
  } catch (error) {
    console.error('重置失败:', error);
    console.error('错误详情:', error.message);
    process.exit(1);
  }
}

resetUser();