import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

/**
 * 修改密码DTO
 * 用于用户修改密码时的数据验证
 */
export class ChangePasswordDto {
  @ApiProperty({ description: '当前密码', example: 'oldpassword123' })
  @IsNotEmpty({ message: '当前密码不能为空' })
  @IsString({ message: '当前密码必须是字符串' })
  oldPassword: string;

  @ApiProperty({ description: '新密码', example: 'newpassword123' })
  @IsNotEmpty({ message: '新密码不能为空' })
  @IsString({ message: '新密码必须是字符串' })
  @Length(6, 20, { message: '新密码长度必须在6-20个字符之间' })
  newPassword: string;
}