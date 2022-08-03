import {
  BaseEntity,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'a_plans' })
export class Plan extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 255, default: '' })
  name: string;

  @Column({ nullable: false, length: 255, default: '' })
  will_give: string;

  @Column({ nullable: false, length: 255, default: '' })
  description: string;

  @Column({ nullable: false, length: 255, default: '' })
  type: string;

  @Column({ nullable: false, length: 255, default: '' })
  currency: string;

  @Column('double precision', { scale: 2 })
  price: number;

  @CreateDateColumn({ readonly: true, select: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', select: false })
  updatedAt: Date;

  @BeforeUpdate()
  public setUpdatedAt() {
    this.updatedAt = new Date(Date.now());
  }
}
