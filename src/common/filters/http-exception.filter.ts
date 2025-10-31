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
 * HTTP异常过滤器
 * 统一处理HTTP异常，返回标准化的错误响应格式
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    // 获取异常响应内容
    const exceptionResponse = exception.getResponse();
    let message: string | string[];
    let error: string;

    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const responseObj = exceptionResponse as any;
      message = responseObj.message || exception.message;
      error = responseObj.error || HttpStatus[status];
    } else {
      message = exceptionResponse as string;
      error = HttpStatus[status];
    }

    // 记录错误日志
    this.logger.error(
      `HTTP Exception: ${status} - ${JSON.stringify(message)} - ${request.method} ${request.url}`,
      exception.stack,
    );

    // 统一错误响应格式
    const errorResponse = {
      success: false,
      code: status,
      message: Array.isArray(message) ? message[0] : message,
      data: null,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    };

    response.status(status).json(errorResponse);
  }
}