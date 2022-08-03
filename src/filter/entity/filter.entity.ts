import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'c_filter' })
export class Filter extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 250, default: '' })
  friendship: string;

  @Column({ nullable: false, length: 250, default: '' })
  romance: string;

  @Column({ nullable: false, length: 250, default: '' })
  business: string;

  @Column({ nullable: false, length: 250, default: '' })
  family: string;
}
