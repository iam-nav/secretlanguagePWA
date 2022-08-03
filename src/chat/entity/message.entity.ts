import { User } from '../../auth/entity/user.entity';
import {
  AfterLoad,
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
import { MessageTypes } from '../enum/message-types.enum';
import { Chat } from './chat.entity';

@Entity({ name: 'a_messages' })
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'jsonb',
    array: false,
    default: () => "'[]'",
    nullable: false,
  })
  content: Array<{ type: string; message: string }>;

  @Column({
    type: 'enum',
    enum: [
      MessageTypes.TEXT,
      MessageTypes.IMAGE,
      MessageTypes.VIDEO,
      MessageTypes.AUDIO,
    ],
    default: MessageTypes.TEXT,
    nullable: false,
  })
  type: MessageTypes;

  @Column({ type: 'integer', array: true, nullable: false })
  readBy: [number];

  @ManyToOne(() => User, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'sender_user',
  })
  user: User;

  @ManyToOne(() => Chat, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'chat',
  })
  @Index()
  chat: Chat;

  @CreateDateColumn({ readonly: true })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @BeforeUpdate()
  public setUpdatedAt() {
    this.updatedAt = new Date(Date.now());
  }

  @AfterLoad()
  getMedia() {
    this.content &&
      this.content.map((c) => {
        if (c.type !== 'text') {
          c.message = `${process.env.AWS_STORAGE_URL}${c.message}`;
        }

        return c;
      });
  }
}
