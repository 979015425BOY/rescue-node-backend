import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

/**
 * 短信验证码实体类
 * 用于存储短信验证码信息
 */
@Entity('sms_codes')
export class SmsCode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 11, comment: '手机号码' })
  phone: string;

  @Column({ length: 6, comment: '验证码' })
  code: string;

  @Column({ length: 20, comment: '验证码类型：register, login, reset_password' })
  type: string;

  @Column({ default: false, name: 'is_used', comment: '是否已使用' })
  isUsed: boolean;

  @Column({ type: 'timestamp', name: 'expires_at', comment: '过期时间' })
  expiresAt: Date;

  @CreateDateColumn({ name: 'created_at', comment: '创建时间' })
  createdAt: Date;
}