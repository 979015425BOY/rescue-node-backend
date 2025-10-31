import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

/**
 * 刷新令牌实体类
 * 用于存储JWT刷新令牌信息
 */
@Entity('refresh_tokens')
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', comment: '刷新令牌' })
  token: string;

  @Column({ name: 'user_id', comment: '用户ID' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'timestamp', name: 'expires_at', comment: '过期时间' })
  expiresAt: Date;

  @Column({ default: false, name: 'is_revoked', comment: '是否已撤销' })
  isRevoked: boolean;

  @CreateDateColumn({ name: 'created_at', comment: '创建时间' })
  createdAt: Date;
}