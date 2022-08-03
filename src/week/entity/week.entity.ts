import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  AfterLoad,
} from 'typeorm';
import { Famous } from '../../famous/entity/famous.entity';
import { User } from '../../auth/entity/user.entity';

@Entity({ name: 'c_week' })
export class Week extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, default: '' })
  date_span: string;

  @Column({ nullable: false, unsigned: true })
  start_month: number;

  @Column({ nullable: false, unsigned: true })
  start_day: number;

  @Column({ type: 'integer' })
  length_week: number;

  @Column({ nullable: false })
  name_long: string;

  @Column({ nullable: false })
  name_medium: string;

  @Column({ nullable: false })
  name_short: string;

  @Column({ type: 'text', nullable: false })
  report: string;

  @Column({ type: 'text', nullable: false })
  advice: string;

  @Column({ nullable: false })
  s1: string;

  @Column({ nullable: false })
  s2: string;

  @Column({ nullable: false })
  s3: string;

  @Column({ nullable: false })
  w1: string;

  @Column({ nullable: false })
  w2: string;

  @Column({ nullable: false })
  w3: string;

  @OneToMany(() => Famous, (famous) => famous.week, {
    cascade: true,
  })
  famous: Famous[];

  @OneToMany(() => User, (user) => user.week_id, {
    cascade: true,
  })
  user: User[];

  image: string;

  @AfterLoad()
  async getImage() {
    return (this.image = `${process.env.AWS_STORAGE_URL}img/icon/week/150/png/${this.id}.png`);
  }
}
