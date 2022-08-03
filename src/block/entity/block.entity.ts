import {
  BaseEntity,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../../auth/entity/user.entity';

@Entity({ name: 'a_user_blocked' })
export class Blocked extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  @ManyToOne(() => User, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'blocked_by',
  })
  blocked_by: User;

  @Column()
  @Index()
  @ManyToOne(() => User, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'blocked_to',
  })
  blocked_to: User;

  @Column({ nullable: false, default: '' })
  reason: string;

  @CreateDateColumn({ readonly: true, select: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', select: false })
  updatedAt: Date;

  @BeforeUpdate()
  public setUpdatedAt() {
    this.updatedAt = new Date(Date.now());
  }
}
