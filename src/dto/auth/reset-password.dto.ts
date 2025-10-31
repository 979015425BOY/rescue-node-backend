import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

/**
 * 重置密码DTO
 * 用于重置密码时的数据验证
 */
export class ResetPasswordDto {
  @ApiProperty({ description: '手机号码', example: '13800138000' })
  @IsNotEmpty({ message: '手机号码不能为空' })
  @IsString({ message: '手机号码必须是字符串' })
  @Matches(/^1[3-9]\d{9}$/, { message: '手机号码格式不正确' })
  phone: string;

  @ApiProperty({ description: '新密码', example: 'newpassword123' })
  @IsNotEmpty({ message: '新密码不能为空' })
  @IsString({ message: '新密码必须是字符串' })
  @Length(6, 20, { message: '新密码长度必须在6-20个字符之间' })
  newPassword: string;

  @ApiProperty({ description: '短信验证码', example: '123456' })
  @IsNotEmpty({ message: '验证码不能为空' })
  @IsString({ message: '验证码必须是字符串' })
  @Length(6, 6, { message: '验证码长度必须是6位' })
  smsCode: string;
}