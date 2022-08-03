import { Way } from '../../way/entity/way.entity';
import { Week } from '../../week/entity/week.entity';
import {
  AfterLoad,
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../auth/entity/user.entity';

@Entity({ name: 'c_path' })
export class Path extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Way, {
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'way_id', referencedColumnName: 'id' })
  way_id: Way;

  @ManyToOne(() => Week, {
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'week_id', referencedColumnName: 'id' })
  week_id: Week;

  @Column({ nullable: false, unsigned: true })
  icon: number;

  @Column({ nullable: false, length: 255, default: '' })
  challenge: string;

  @Column({ nullable: false, length: 255, default: '' })
  fulfillment: string;

  @Column({ type: 'text', nullable: false })
  report: string;

  @OneToMany(() => User, (user) => user.path_id, {
    cascade: true,
  })
  user: User[];

  image: string;

  @AfterLoad()
  async getImage() {
    return (this.image = `${process.env.AWS_STORAGE_URL}img/icon/path/150/png/${this.icon}.png`);
  }
}
