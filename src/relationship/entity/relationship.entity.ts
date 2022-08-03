import {
  AfterLoad,
  BaseEntity,
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'c_relationship' })
export class Relationship extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ nullable: false, unsigned: true })
  week1: number;

  @Index()
  @Column({ nullable: false, unsigned: true })
  week2: number;

  @Column({ nullable: false, unsigned: true })
  icon: number;

  @Column({ nullable: false, length: 100, default: '' })
  title: string;

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
  report: string;

  @Column({ type: 'text', nullable: false })
  advice: string;

  @Index()
  @Column({ nullable: false, unsigned: true })
  friendship: number;

  @Column({ nullable: false, unsigned: true })
  family: number;

  @Index()
  @Column({ nullable: false, unsigned: true })
  romance: number;

  @Index()
  @Column({ nullable: false, unsigned: true })
  business: number;

  @Index()
  @Column({ nullable: false, length: 50, default: '' })
  ideal: string;

  @Column({ nullable: false, length: 50, default: '' })
  problematic: string;

  @Column({ type: 'text', nullable: false })
  cache: string;

  image: string;

  @AfterLoad()
  async getImage() {
    let my_string = '' + this.icon;
    while (my_string.length < 4) {
      my_string = '0' + my_string;
    }

    return (this.image = `${process.env.AWS_STORAGE_URL}img/icon/rel/150/png/${my_string}.png`);
  }
}
