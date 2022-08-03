import {
  AfterLoad,
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../auth/entity/user.entity';

@Entity({ name: 'c_month' })
export class Month extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unsigned: true })
  start_day: number;

  @Column({ nullable: false, unsigned: true })
  start_month: number;

  @Column({ nullable: false, length: 50, default: '' })
  span1: string;

  @Column({ nullable: false, length: 50 })
  span1_short: string;

  @Column({ nullable: false, length: 50, default: '' })
  span2: string;

  @Column({ nullable: false, length: 50 })
  span2_short: string;

  @Column({ type: 'text', nullable: false })
  name: string;

  @Column({ type: 'text', nullable: false })
  name_plural: string;

  @Column({ type: 'text', nullable: false })
  sign: string;

  @Column({ nullable: false, length: 12 })
  season: string;

  @Column({ nullable: false, length: 50, default: '' })
  mode: string;

  @Column({ nullable: false, length: 50, default: '' })
  motto: string;

  @Column({ type: 'text', nullable: false })
  report: string;

  @Column({ type: 'text', nullable: false })
  personality: string;

  @OneToMany(() => User, (user) => user.month_id, {
    cascade: true,
  })
  user: User[];

  image: string;

  @AfterLoad()
  async getImage() {
    return (this.image = `${process.env.AWS_STORAGE_URL}img/icon/month/150/png/${this.id}.png`);
  }
}
