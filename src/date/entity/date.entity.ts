import { Season } from '../../season/entity/season.entity';
import { Month } from '../../month/entity/month.entity';
import { Week } from '../../week/entity/week.entity';
import { Day } from '../../day/entity/day.entity';
import {
  AfterLoad,
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'c_date' })
export class Date extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unsigned: true })
  dob_id: number;

  @Index()
  @Column({ type: 'text', nullable: false })
  date_name: string;

  @Index()
  @Column({ type: 'integer', nullable: false })
  y8: number;

  @Column()
  @ManyToOne(() => Day, {
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'day_id', referencedColumnName: 'id' })
  day_id: Day;

  @Column()
  @ManyToOne(() => Week, {
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'week_id', referencedColumnName: 'id' })
  week_id: Week;

  @Column()
  @ManyToOne(() => Month, {
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'month_id', referencedColumnName: 'id' })
  month_id: Month;

  @Column()
  @ManyToOne(() => Season, {
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'season_id', referencedColumnName: 'id' })
  season_id: Season;

  @Column({ type: 'integer', nullable: false, unsigned: true })
  path_id: number;

  @Column({ type: 'integer', nullable: false, unsigned: true })
  way_id: number;

  @Index()
  @Column({ type: 'text', nullable: false })
  sln: string;

  @Column({ nullable: false, length: 50, default: '' })
  cache: string;

  image: string;

  @AfterLoad()
  async getImage() {
    return (this.image = `${process.env.AWS_STORAGE_URL}img/icon/day/150/png/${
      this.day_id.id - 1
    }.png`);
  }
}
