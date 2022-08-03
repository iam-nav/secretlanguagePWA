import {
  AfterLoad,
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../auth/entity/user.entity';

@Entity({ name: 'c_season' })
export class Season extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 50, default: '' })
  name: string;

  @Column({ nullable: false, length: 50, default: '' })
  description: string;

  @Column({ nullable: false, length: 50, default: '' })
  span1: string;

  @Column({ nullable: false, length: 50, default: '' })
  span1_short: string;

  @Column({ nullable: false, length: 50, default: '' })
  span2: string;

  @Column({ nullable: false, length: 50, default: '' })
  span2_short: string;

  @Column({ nullable: false, length: 50, default: '' })
  season_name: string;

  @Column({ type: 'text', nullable: false })
  activity: string;

  @Column({ type: 'text', nullable: false })
  report: string;

  @Column({ nullable: false, length: 50, default: '' })
  faculty: string;

  @OneToMany(() => User, (user) => user.season_id, {
    cascade: true,
  })
  user: User[];

  image: string;

  @AfterLoad()
  async getImage() {
    return (this.image = `${process.env.AWS_STORAGE_URL}img/icon/season/150/png/${this.id}.png`);
  }
}
