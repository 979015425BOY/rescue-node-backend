import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { SmsCode } from '../../entities/sms-code.entity';

/**
 * 短信验证码服务
 * 用于发送和验证短信验证码
 */
@Injectable()
export class SmsService {
  constructor(
    @InjectRepository(SmsCode)
    private smsCodeRepository: Repository<SmsCode>,
  ) {}

  /**
   * 发送短信验证码
   * @param phone 手机号码
   * @param type 验证码类型
   * @returns 发送结果
   */
  async sendSmsCode(phone: string, type: string): Promise<{ success: boolean; message: string }> {
    // 检查是否在1分钟内已发送过验证码
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    const recentCode = await this.smsCodeRepository.findOne({
      where: {
        phone,
        type,
        createdAt: LessThan(oneMinuteAgo),
      },
      order: { createdAt: 'DESC' },
    });

    if (recentCode && recentCode.createdAt > oneMinuteAgo) {
      throw new BadRequestException('请等待1分钟后再发送验证码');
    }

    // 生成6位数字验证码（开发阶段固定为123456）
    const code = '123456';
    
    // 设置过期时间（5分钟）
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // 保存验证码到数据库
    const smsCode = this.smsCodeRepository.create({
      phone,
      code,
      type,
      expiresAt,
      isUsed: false,
    });

    await this.smsCodeRepository.save(smsCode);

    // 在开发环境中，直接返回成功
    // 在生产环境中，这里应该调用真实的短信服务API
    console.log(`发送短信验证码到 ${phone}: ${code} (类型: ${type})`);

    return {
      success: true,
      message: '验证码发送成功',
    };
  }

  /**
   * 验证短信验证码
   * @param phone 手机号码
   * @param code 验证码
   * @param type 验证码类型
   * @returns 验证结果
   */
  async verifySmsCode(phone: string, code: string, type: string): Promise<boolean> {
    // 查找未使用且未过期的验证码
    const smsCode = await this.smsCodeRepository.findOne({
      where: {
        phone,
        code,
        type,
        isUsed: false,
      },
      order: { createdAt: 'DESC' },
    });

    if (!smsCode) {
      throw new BadRequestException('验证码不正确或已失效');
    }

    // 检查是否过期
    if (smsCode.expiresAt < new Date()) {
      throw new BadRequestException('验证码已过期');
    }

    // 标记验证码为已使用
    smsCode.isUsed = true;
    await this.smsCodeRepository.save(smsCode);

    return true;
  }

  /**
   * 清理过期的验证码
   */
  async cleanExpiredCodes(): Promise<void> {
    await this.smsCodeRepository.delete({
      expiresAt: LessThan(new Date()),
    });
  }
}