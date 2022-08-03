import {
  BaseEntity,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Unique,
  Generated,
  Index,
  AfterLoad,
  JoinColumn,
  ManyToOne,
  OneToMany,
  getRepository,
} from 'typeorm';
import { Point } from 'geojson';
import { Gender } from '../../gender/entity/gender.entity';
import { Interest } from '../../interest/entity/interest.entity';
import { Day } from '../../day/entity/day.entity';
import { Path } from './../../path/entity/path.entity';
import { Way } from './../../way/entity/way.entity';
import { Season } from './../../season/entity/season.entity';
import { Month } from './../../month/entity/month.entity';
import { Week } from './../../week/entity/week.entity';
import { UserImages } from './user-images.entity';

@Entity({ name: 'a_users' })
@Unique(['username', 'phone_number'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ nullable: false })
  @Generated('uuid')
  username: string;

  @Index()
  @Column({ nullable: false, default: '' })
  name: string;

  @Column({ nullable: false, default: '' })
  bio: string;

  @Column({ nullable: false, default: '' })
  instagram: string;

  @Index({ unique: true })
  @Column({ nullable: false, unique: true })
  phone_number: string;

  @Index()
  @Column({ nullable: false })
  country: string;

  @Index()
  @Column({ nullable: true })
  country_name: string;

  @Index()
  @Column({ nullable: false })
  country_code: string;

  @Index()
  @Column({ nullable: false, default: '' })
  city: string;

  @Column({ nullable: false, default: '' })
  address: string;

  @Column({ nullable: false, length: 6, default: '', select: false })
  otp: string;

  @Column({ nullable: false, default: false })
  is_verified: boolean;

  @Column({ nullable: false, default: false })
  is_banned: boolean;

  @ManyToOne(() => Day, {
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'day_id', referencedColumnName: 'id' })
  day_id: Day;

  @ManyToOne(() => Week, {
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'week_id', referencedColumnName: 'id' })
  week_id: Week;

  @ManyToOne(() => Month, {
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'month_id', referencedColumnName: 'id' })
  month_id: Month;

  @ManyToOne(() => Season, {
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'season_id', referencedColumnName: 'id' })
  season_id: Season;

  @ManyToOne(() => Way, {
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'way_id', referencedColumnName: 'id' })
  way_id: Way;

  @ManyToOne(() => Path, {
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'path_id', referencedColumnName: 'id' })
  path_id: Path;

  @Column({ nullable: false, default: '' })
  date_name: string;

  @Column({ nullable: false, unsigned: true })
  dob: number;

  @Column({ nullable: false })
  sln: string;

  @Column({ nullable: false, default: '' })
  friendship_filter: string;

  @Column({ nullable: false, default: '' })
  romance_filter: string;

  @Column({ nullable: false, default: '' })
  business_filter: string;

  @Column({ nullable: false, default: '' })
  family_filter: string;

  @Index({ spatial: true })
  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  location: Point;

  @Column({ default: false, nullable: false })
  locationEdittedByUser: boolean;

  @Index()
  @ManyToOne(() => Gender, {
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'gender', referencedColumnName: 'id' })
  gender: Gender;

  @Column({ default: 0, nullable: false })
  gender_preference: number;

  @ManyToOne(() => Interest, {
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'interested_in', referencedColumnName: 'id' })
  interested_in: Interest;

  @Column({ nullable: false, default: 'user/default.png' })
  image_path: string;

  @Column({ type: 'integer', nullable: false, unsigned: true, default: 1 })
  user_type: number;

  @Column({ default: false, nullable: false })
  vip_by_admin: boolean;

  @Column({ default: '', nullable: true })
  device_token: string;

  @Column({ default: false, nullable: false })
  is_old_user: boolean;

  @Column({ default: false, nullable: false })
  is_imported_user: boolean;

  @Index()
  @Column({ default: false, nullable: false })
  attractive: boolean;

  @Index()
  @Column({ default: 17, nullable: false })
  age: number;

  @Index()
  @Column({ default: false, nullable: false })
  hasProfilePicture: boolean;

  @CreateDateColumn({ readonly: true })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', select: false })
  updatedAt: Date;

  @OneToMany(() => UserImages, (userImage) => userImage.user, {
    cascade: true,
  })
  images: UserImages[];

  image: string;

  @AfterLoad()
  async getImage() {
    const image = await getRepository(UserImages)
      .createQueryBuilder('a_user_images')
      .where(
        'a_user_images.user = :user AND a_user_images.is_profile_pic = :is_profile_pic',
        {
          user: this.id,
          is_profile_pic: true,
        },
      )
      .getOne();

    if (image) {
      return (this.image = image.image);
    }

    return (this.image = `${process.env.IMAGE_KIT}${
      this.image_path ? this.image_path.split('/')[1] : 'default.png'
    }?tr=w-600,h-600`);
  }

  @BeforeUpdate()
  public setUpdatedAt() {
    this.updatedAt = new Date(Date.now());
  }
}
