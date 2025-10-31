import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * 全局异常过滤器
 * 捕获所有未处理的异常，包括非HTTP异常
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as any;
        message = Array.isArray(responseObj.message) 
          ? responseObj.message[0] 
          : responseObj.message || exception.message;
      } else {
        message = exceptionResponse as string;
      }
    } else {
      // 处理非HTTP异常
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = '服务器内部错误';
      
      // 记录详细的错误信息
      this.logger.error(
        `Unhandled Exception: ${exception}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    }

    // 记录错误日志
    this.logger.error(
      `Exception: ${status} - ${message} - ${request.method} ${request.url}`,
    );

    // 统一错误响应格式
    const errorResponse = {
      success: false,
      code: status,
      message,
      data: null,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    };

    response.status(status).json(errorResponse);
  }
}