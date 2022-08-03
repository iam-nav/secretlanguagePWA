import { Day } from '../../day/entity/day.entity';
import { Way } from '../../way/entity/way.entity';
import { Week } from '../../week/entity/week.entity';
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  AfterLoad,
} from 'typeorm';

@Entity({ name: 'c_famous' })
export class Famous extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 100, default: '' })
  name: string;

  @Column({ nullable: false })
  dob_id: number;

  @Column({ nullable: false, default: '' })
  sl_name: string;

  @Column({ nullable: false })
  birthdate: number;

  @Column({ nullable: false, unsigned: true })
  day_id: number;

  @Column({ nullable: false, unsigned: true })
  week_id: number;

  @Column({ nullable: false, unsigned: true })
  month_id: number;

  @Column({ nullable: false, unsigned: true })
  season_id: number;

  @Column({ nullable: false, unsigned: true })
  path_id: number;

  @Column({ nullable: false, unsigned: true })
  way_id: number;

  @ManyToOne(() => Day, (day) => day.id, {
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'day_id' })
  day: Day;

  @ManyToOne(() => Way, (way) => way.id, {
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'way_id' })
  way: Way;

  @ManyToOne(() => Week, (week) => week.id, {
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'week_id' })
  week: Week;

  image: string;

  @AfterLoad()
  async getImage() {
    return (this.image = `${process.env.AWS_STORAGE_URL}img/famous/${this.id}.jpg`);
  }
}
