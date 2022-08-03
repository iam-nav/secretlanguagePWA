import { UserLeftSwipes } from '../entity/user-left-swipes.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(UserLeftSwipes)
export class UserLeftSwipesRepository extends Repository<UserLeftSwipes> {}
