import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Public } from './auth/decorators/public.decorator';

/**
 * 应用主控制器
 * 提供基础的健康检查和应用信息接口
 */
@ApiTags('应用信息')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * 获取应用欢迎信息
   * @returns 欢迎消息
   */
  @Get()
  @ApiOperation({ summary: '获取应用欢迎信息' })
  @ApiResponse({ status: 200, description: '返回欢迎消息' })
  getHello(): string {
    return this.appService.getHello();
  }

  /**
   * 健康检查端点
   * @returns 健康状态信息
   */
  @Public()
  @Get('health')
  @ApiOperation({ summary: '健康检查' })
  @ApiResponse({ 
    status: 200, 
    description: '返回应用健康状态',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        uptime: { type: 'number', example: 123.456 },
        environment: { type: 'string', example: 'production' },
        version: { type: 'string', example: '0.0.1' }
      }
    }
  })
  getHealth(): object {
    return this.appService.getHealth();
  }
}
