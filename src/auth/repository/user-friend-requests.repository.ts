import { EntityRepository, Repository } from 'typeorm';
import { UserFriendRequests } from '../entity/user-friend-requests.entity';

@EntityRepository(UserFriendRequests)
export class UserFriendRequestsRepository extends Repository<UserFriendRequests> {}
