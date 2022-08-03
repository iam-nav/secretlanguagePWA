import { User } from '../../auth/entity/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'a_interests' })
export class Interest extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 50, default: '' })
  name: string;

  @Column({ nullable: false, length: 255, default: '' })
  description: string;

  @Column({ nullable: false, default: true, select: false })
  isActive: boolean;

  @OneToMany(() => User, (user) => user.interested_in, {
    cascade: true,
  })
  user: User[];
}
