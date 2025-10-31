import { Injectable } from '@nestjs/common';

/**
 * 应用服务类
 * 提供基础的应用功能和健康检查服务
 */
@Injectable()
export class AppService {
  /**
   * 获取应用欢迎信息
   * @returns 欢迎消息字符串
   */
  getHello(): string {
    return 'NestJS + TypeScript + MySQL API 服务正在运行！';
  }

  /**
   * 获取应用健康状态
   * @returns 包含健康状态信息的对象
   */
  getHealth(): object {
    const packageJson = require('../package.json');
    
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: packageJson.version,
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100
      },
      database: {
        status: 'connected', // 这里可以添加实际的数据库连接检查
        type: 'MySQL'
      }
    };
  }
}
