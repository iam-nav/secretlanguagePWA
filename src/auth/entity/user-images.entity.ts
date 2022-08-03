import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BeforeUpdate,
  CreateDateColumn,
  UpdateDateColumn,
  AfterLoad,
  JoinColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'a_user_images' })
export class UserImages extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @ManyToOne(() => User, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'user',
  })
  user: User;

  @Index()
  @Column({ nullable: false, default: 'user/default.png' })
  image: string;

  @Column({ default: true, nullable: false, select: false })
  is_approved: boolean;

  @Index()
  @Column({ default: false, nullable: false })
  is_profile_pic: boolean;

  @CreateDateColumn({ readonly: true, select: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', select: false })
  updatedAt: Date;

  @AfterLoad()
  async getImage() {
    return (this.image = `${process.env.IMAGE_KIT}${
      this.image.split('/')[1]
    }?tr=w-600,h-600`);
  }

  @BeforeUpdate()
  public setUpdatedAt() {
    this.updatedAt = new Date(Date.now());
  }
}
