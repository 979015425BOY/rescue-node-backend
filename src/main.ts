import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

let app: any;

async function createApp() {
  if (!app) {
    app = await NestFactory.create(AppModule);

    // 启用全局异常过滤器
    app.useGlobalFilters(new HttpExceptionFilter());

    // 启用全局日志拦截器
    app.useGlobalInterceptors(new LoggingInterceptor());

    // 启用全局验证管道
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    // 启用 CORS
    app.enableCors();

    // 设置全局路由前缀
    app.setGlobalPrefix('api');

    // 配置 Swagger
    const config = new DocumentBuilder()
      .setTitle('救援系统 API')
      .setDescription('基于 NestJS + TypeScript + MySQL 的救援系统 API 文档')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('用户管理', '用户相关接口')
      .addTag('认证管理', '认证相关接口')
      .build();
    
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.init();
  }
  return app;
}

// Vercel serverless 函数导出
export default async (req: any, res: any) => {
  const app = await createApp();
  const server = app.getHttpAdapter().getInstance();
  return server(req, res);
};

// 本地开发环境启动
async function bootstrap() {
  const app = await createApp();
  const port = process.env.APP_PORT || 3000;
  await app.listen(port);
  console.log(`应用程序运行在: http://localhost:${port}`);
  console.log(`API 文档地址: http://localhost:${port}/api`);
}

// 只在非 Vercel 环境下启动
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  bootstrap();
}
