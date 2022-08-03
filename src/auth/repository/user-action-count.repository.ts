import { UserActionCount } from './../entity/user-action-count.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(UserActionCount)
export class UserActionCountRepository extends Repository<UserActionCount> {}
