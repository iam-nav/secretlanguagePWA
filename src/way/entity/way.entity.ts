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

@Entity({ name: 'c_way' })
export class Way extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, default: '' })
  name: string;

  @Column({ nullable: false, default: '' })
  prefix: string;

  @Column({ nullable: false, default: '' })
  week_from: string;

  @Column({ nullable: false, default: '' })
  week_to: string;

  @Column({ nullable: false, default: '' })
  s1: string;

  @Column({ nullable: false, default: '' })
  s2: string;

  @Column({ nullable: false, default: '' })
  s3: string;

  @Column({ nullable: false, default: '' })
  w1: string;

  @Column({ nullable: false, default: '' })
  w2: string;

  @Column({ nullable: false, default: '' })
  w3: string;

  @Column({ type: 'text', nullable: false })
  report: string;

  @Column({ type: 'text', nullable: false })
  suggestion: string;

  @Column({ type: 'text', nullable: false })
  occurances: string;

  @Column({ nullable: false, default: '' })
  core_lesson: string;

  @Column({ nullable: false, default: '' })
  goal: string;

  @Column({ nullable: false, default: '' })
  must_release: string;

  @Column({ nullable: false, default: '' })
  reward: string;

  @Column({ nullable: false, default: '' })
  balance_point: string;

  @OneToMany(() => Famous, (famous) => famous.way, {
    cascade: true,
  })
  famous: Famous[];

  @OneToMany(() => User, (user) => user.way_id, {
    cascade: true,
  })
  user: User[];

  image: string;

  @AfterLoad()
  async getImage() {
    return (this.image = `${process.env.AWS_STORAGE_URL}img/icon/way/150/png/${this.id}.png`);
  }
}
