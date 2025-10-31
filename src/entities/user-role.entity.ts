import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Role } from './role.entity';

/**
 * 用户角色关联实体类
 * 用于管理用户与角色的多对多关系
 * 记录角色分配的详细信息，包括分配时间和分配人
 */
@Entity('user_roles')
export class UserRole {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ comment: '用户ID' })
  userId: string;

  @Column({ comment: '角色ID' })
  roleId: string;

  @Column({ 
    nullable: true, 
    comment: '分配人ID，记录是谁分配的这个角色' 
  })
  assignedBy: string;

  @CreateDateColumn({ comment: '角色分配时间' })
  assignedAt: Date;

  // 与用户的多对一关系
  @ManyToOne(() => User, user => user.userRoles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  // 与角色的多对一关系
  @ManyToOne(() => Role, role => role.userRoles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roleId' })
  role: Role;

  // 分配人关系（可选，指向另一个用户）
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assignedBy' })
  assigner: User;
}