import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsIn, Matches } from 'class-validator';

/**
 * 发送短信验证码DTO
 * 用于发送短信验证码时的数据验证
 */
export class SendSmsDto {
  @ApiProperty({ description: '手机号码', example: '13800138000' })
  @IsNotEmpty({ message: '手机号码不能为空' })
  @IsString({ message: '手机号码必须是字符串' })
  @Matches(/^1[3-9]\d{9}$/, { message: '手机号码格式不正确' })
  phone: string;

  @ApiProperty({ 
    description: '验证码类型', 
    example: 'register',
    enum: ['register', 'login', 'reset_password']
  })
  @IsNotEmpty({ message: '验证码类型不能为空' })
  @IsString({ message: '验证码类型必须是字符串' })
  @IsIn(['register', 'login', 'reset_password'], { message: '验证码类型必须是register、login或reset_password' })
  type: string;
}