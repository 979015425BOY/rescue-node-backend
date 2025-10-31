import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, Matches } from 'class-validator';

/**
 * 创建用户DTO
 * 用于用户注册时的数据验证
 */
export class CreateUserDto {
  @ApiProperty({ description: '手机号码', example: '13800138000' })
  @IsNotEmpty({ message: '手机号码不能为空' })
  @IsString({ message: '手机号码必须是字符串' })
  @Matches(/^1[3-9]\d{9}$/, { message: '手机号码格式不正确' })
  phone: string;

  @ApiProperty({ description: '用户名', example: 'john_doe' })
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString({ message: '用户名必须是字符串' })
  @Length(3, 50, { message: '用户名长度必须在3-50个字符之间' })
  username: string;

  @ApiProperty({ description: '邮箱', example: 'john@example.com', required: false })
  @IsOptional()
  @IsEmail({}, { message: '邮箱格式不正确' })
  email?: string;

  @ApiProperty({ description: '密码', example: 'password123' })
  @IsNotEmpty({ message: '密码不能为空' })
  @IsString({ message: '密码必须是字符串' })
  @Length(6, 20, { message: '密码长度必须在6-20个字符之间' })
  password: string;

  @ApiProperty({ description: '昵称', example: 'John', required: false })
  @IsOptional()
  @IsString({ message: '昵称必须是字符串' })
  @Length(1, 100, { message: '昵称长度必须在1-100个字符之间' })
  nickname?: string;

  @ApiProperty({ description: '头像URL', example: 'https://example.com/avatar.jpg', required: false })
  @IsOptional()
  @IsString({ message: '头像URL必须是字符串' })
  avatar?: string;

  @ApiProperty({ description: '真实姓名', example: '张三', required: false })
  @IsOptional()
  @IsString({ message: '真实姓名必须是字符串' })
  @Length(1, 50, { message: '真实姓名长度必须在1-50个字符之间' })
  realName?: string;

  @ApiProperty({ description: '身份证号', example: '110101199001011234', required: false })
  @IsOptional()
  @IsString({ message: '身份证号必须是字符串' })
  @Matches(/^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, { message: '身份证号格式不正确' })
  idCard?: string;

  @ApiProperty({ description: '紧急联系人', example: '李四', required: false })
  @IsOptional()
  @IsString({ message: '紧急联系人必须是字符串' })
  @Length(1, 50, { message: '紧急联系人长度必须在1-50个字符之间' })
  emergencyContact?: string;

  @ApiProperty({ description: '紧急联系电话', example: '13900139000', required: false })
  @IsOptional()
  @IsString({ message: '紧急联系电话必须是字符串' })
  @Matches(/^1[3-9]\d{9}$/, { message: '紧急联系电话格式不正确' })
  emergencyPhone?: string;

  @ApiProperty({ description: '地址', example: '北京市朝阳区', required: false })
  @IsOptional()
  @IsString({ message: '地址必须是字符串' })
  address?: string;
}