import { EntityRepository, Repository } from 'typeorm';
import { UserImages } from '../entity/user-images.entity';

@EntityRepository(UserImages)
export class UserImagesRepository extends Repository<UserImages> {}
