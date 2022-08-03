import { NotificationTypesEnum } from '../enum/notificationTypes.enum';
import { User } from '../../auth/entity/user.entity';
import { UserImages } from '../../auth/entity/user-images.entity';
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  BeforeUpdate,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  AfterLoad,
} from 'typeorm';

@Entity({ name: 'a_admin_notifications' })
export class AdminNotifications extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: [
      NotificationTypesEnum.ADD_IMAGE,
      NotificationTypesEnum.REPORT_USER,
      NotificationTypesEnum.FLAG_USER,
    ],
    nullable: false,
    default: NotificationTypesEnum.ADD_IMAGE,
  })
  type: NotificationTypesEnum;

  @Column({ type: 'text', nullable: false })
  message: string;

  @ManyToOne(() => User, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'user' })
  user: User;

  @ManyToOne(() => UserImages, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'image' })
  image: UserImages;

  @CreateDateColumn({ readonly: true })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @BeforeUpdate()
  public setUpdatedAt() {
    this.updatedAt = new Date(Date.now());
  }

  @AfterLoad()
  private changeMessage() {
    if (this.type === NotificationTypesEnum.ADD_IMAGE) {
      return (this.message = `${this.user.name} ${this.message}`);
    } else {
      return (this.message = `${this.message} ${this.user.name}`);
    }
  }
}
