import { UserUnlockedRelationships } from './../entity/user-unlocked-relationships.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(UserUnlockedRelationships)
export class UserUnlockedRelationshipsRepository extends Repository<UserUnlockedRelationships> {}
