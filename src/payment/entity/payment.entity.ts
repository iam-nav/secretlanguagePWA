import { User } from '../../auth/entity/user.entity';
import {
  BaseEntity,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  Index,
} from 'typeorm';

@Entity({ name: 'a_payments' })
export class Payment extends BaseEntity {
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

  @Column({ default: '(SLN) Monthly' })
  item_name: string;

  @Index()
  @Column({ default: 'subscr_signup' })
  txn_type: string;

  @Column()
  purchase_date: string;

  @Column()
  transaction_id: string;

  @Column({ default: '1 M' })
  period: string;

  @Column({ default: 'completed' })
  payment_status: string;

  @Column({ default: '9.99' })
  gross_amount: string;

  @Column({ default: '0.00' })
  fee_amount: string;

  @Column({ default: 'USD' })
  currency: string;

  @Column({ default: '2' })
  subsc_id: string;

  @Column({ default: '1' })
  payer_id: string;

  @Column({ default: 'verified' })
  payer_status: string;

  @Column({ type: 'text' })
  transaction: string;

  @Column({ type: 'text' })
  receipt: string;

  @CreateDateColumn({ readonly: true, select: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', select: false })
  updatedAt: Date;

  @BeforeUpdate()
  public setUpdatedAt() {
    this.updatedAt = new Date(Date.now());
  }
}
