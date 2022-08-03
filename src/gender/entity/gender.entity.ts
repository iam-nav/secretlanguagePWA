import { User } from '../../auth/entity/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'a_genders' })
export class Gender extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 50, default: '' })
  gender_name: string;

  @Column({ nullable: false, default: true, select: false })
  isActive: boolean;

  @OneToMany(() => User, (user) => user.gender, {
    cascade: true,
  })
  user: User[];
}
