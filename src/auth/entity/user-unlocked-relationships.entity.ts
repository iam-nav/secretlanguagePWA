import { UnlockedReportEnum } from '../enum/unlocked-reports.enum';
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
import { User } from './user.entity';

@Entity({ name: 'a_user_unlocked_relationships' })
export class UserUnlockedRelationships extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @ManyToOne(() => User, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'user',
  })
  user: User;

  @Index()
  @Column({ nullable: false })
  date_name_1: string;

  @Index()
  @Column({ nullable: false })
  date_name_2: string;

  @Column({
    type: 'enum',
    enum: [UnlockedReportEnum.VIP_USER, UnlockedReportEnum.BOUGHT_REPORT],
    nullable: false,
  })
  type: string;

  @CreateDateColumn({ readonly: true, select: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', select: false })
  updatedAt: Date;

  @BeforeUpdate()
  public setUpdatedAt() {
    this.updatedAt = new Date(Date.now());
  }
}
