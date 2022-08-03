import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  BeforeUpdate,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { FriendRequestStatus } from '../enum/friend-request-status.enum';

@Entity({ name: 'a_user_friend_requests' })
export class UserFriendRequests extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  @ManyToOne(() => User, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'send_by',
  })
  send_by: User;

  @Index()
  @Column()
  @ManyToOne(() => User, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'send_to',
  })
  send_to: User;

  @Index()
  @Column({
    type: 'enum',
    enum: [
      FriendRequestStatus.PENDING,
      FriendRequestStatus.ACCEPTED,
      FriendRequestStatus.REJECTED,
    ],
    default: FriendRequestStatus.PENDING,
    nullable: false,
  })
  status: FriendRequestStatus;

  @CreateDateColumn({ readonly: true, select: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', select: false })
  updatedAt: Date;

  @BeforeUpdate()
  public setUpdatedAt() {
    this.updatedAt = new Date(Date.now());
  }
}
