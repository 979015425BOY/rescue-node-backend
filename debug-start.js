// 调试启动脚本
const { NestFactory } = require('@nestjs/core');
const { AppSimpleModule } = require('./dist/app-simple.module');

async function bootstrap() {
  try {
    console.log('正在启动简化版应用...');
    const app = await NestFactory.create(AppSimpleModule);
    
    // 启用CORS
    app.enableCors();
    
    // 设置全局前缀
    app.setGlobalPrefix('api');
    
    const port = process.env.APP_PORT || 3000;
    await app.listen(port);
    
    console.log(`应用程序运行在: http://localhost:${port}`);
    console.log(`健康检查: http://localhost:${port}/api/health`);
  } catch (error) {
    console.error('启动失败:', error);
    console.error('错误详情:', error.message);
    process.exit(1);
  }
}

bootstrap();