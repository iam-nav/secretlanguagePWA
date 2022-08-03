import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  BeforeUpdate,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
  AfterLoad,
} from 'typeorm';

@Entity({ name: 'a_admins' })
export class Admin extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  name: string;

  @Column({ nullable: false, unique: true })
  username: string;

  @Column({ nullable: false, default: '', select: false })
  password: string;

  @Column({ nullable: false, default: 'user/default.png' })
  image_path: string;

  @Column({ default: '', nullable: true })
  device_token: string;

  @CreateDateColumn({ readonly: true, select: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', select: false })
  updatedAt: Date;

  image: string;

  @AfterLoad()
  async getImage() {
    this.image = `${process.env.AWS_STORAGE_URL}${this.image_path}`;
    this.image_path = undefined;
    return this;
  }

  @BeforeUpdate()
  public setUpdatedAt() {
    this.updatedAt = new Date(Date.now());
  }
}
