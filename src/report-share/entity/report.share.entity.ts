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

@Entity({ name: 'a_share_report' })
export class ShareReported extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @ManyToOne(() => User, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'user_id',
  })
  user_id: User;

  @Column({ nullable: false, default: '' })
  links: string;

  @CreateDateColumn({ readonly: true, select: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', select: false })
  updatedAt: Date;

  @BeforeUpdate()
  public setUpdatedAt() {
    this.updatedAt = new Date(Date.now());
  }
}
