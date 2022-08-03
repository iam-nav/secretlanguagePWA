import { Message } from './message.entity';
import {
  BaseEntity,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
  Index,
} from 'typeorm';

@Entity({ name: 'a_chats' })
export class Chat extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 100, default: '' })
  chatName: string;

  @Column({ default: false, nullable: false })
  isGroupChat: boolean;

  @Index()
  @Column({ type: 'integer', array: true, nullable: false })
  users: [number];

  @Column({ default: true, nullable: false, select: false })
  active: boolean;

  @OneToOne(() => Message, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  latestMessage: Message;

  @CreateDateColumn({ readonly: true, select: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @BeforeUpdate()
  public setUpdatedAt() {
    this.updatedAt = new Date(Date.now());
  }
}
