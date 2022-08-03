import { Famous } from '../../famous/entity/famous.entity';
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  AfterLoad,
} from 'typeorm';
import { User } from '../../auth/entity/user.entity';

@Entity({ name: 'c_day' })
export class Day extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  day: number;

  @Column({ nullable: false })
  month: number;

  @Column({ nullable: false, length: 50, default: '' })
  date_name: string;

  @Column({ nullable: false, length: 100, default: '' })
  day_name: string;

  @Column({ nullable: false, length: 100, default: '' })
  day_name_short: string;

  @Column({ nullable: false, length: 50, default: '' })
  s1: string;

  @Column({ nullable: false, length: 50, default: '' })
  s2: string;

  @Column({ nullable: false, length: 50, default: '' })
  s3: string;

  @Column({ nullable: false, length: 50, default: '' })
  w1: string;

  @Column({ nullable: false, length: 50, default: '' })
  w2: string;

  @Column({ nullable: false, length: 50, default: '' })
  w3: string;

  @Column({ type: 'text', nullable: false })
  meditation: string;

  @Column({ type: 'text', nullable: false })
  report: string;

  @Column({ type: 'text', nullable: false })
  numbers: string;

  @Column({ type: 'text', nullable: false })
  archetype: string;

  @Column({ type: 'text', nullable: false })
  health: string;

  @Column({ type: 'text', nullable: false })
  advice: string;

  @OneToMany(() => Famous, (famous) => famous.day, {
    cascade: true,
  })
  famous: Famous[];

  @OneToMany(() => User, (user) => user.day_id, {
    cascade: true,
  })
  user: User[];

  image: string;

  @AfterLoad()
  async getImage() {
    return (this.image = `${process.env.AWS_STORAGE_URL}img/icon/day/150/png/${
      this.id - 1
    }.png`);
  }
}
