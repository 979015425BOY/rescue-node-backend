import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsBoolean, IsNumber, IsString, Length } from 'class-validator';

/**
 * 更新用户DTO
 * 用于用户信息更新时的数据验证
 */
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ description: '是否激活', example: true, required: false })
  @IsOptional()
  @IsBoolean({ message: '激活状态必须是布尔值' })
  isActive?: boolean;

  @ApiProperty({ description: '积分', example: 100, required: false })
  @IsOptional()
  @IsNumber({}, { message: '积分必须是数字' })
  points?: number;

  @ApiProperty({ description: '用户等级', example: 'VIP用户', required: false })
  @IsOptional()
  @IsString({ message: '用户等级必须是字符串' })
  @Length(1, 20, { message: '用户等级长度必须在1-20个字符之间' })
  level?: string;
}