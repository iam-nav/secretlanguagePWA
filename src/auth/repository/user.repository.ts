import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entity/user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async getUsersCount() {
    return await this.createQueryBuilder('a_users').getCount();
  }

  async getWomanCount() {
    return await this.createQueryBuilder('a_users')
      .where('a_users.gender = 2')
      .getCount();
  }

  async getManCount() {
    return await this.createQueryBuilder('a_users')
      .where('a_users.gender = 1')
      .getCount();
  }

  async getBannedUsersCount() {
    return await this.createQueryBuilder('a_users')
      .where('a_users.is_banned = true')
      .getCount();
  }

  async getUserForChats(u: number) {
    return await this.createQueryBuilder('a_users')
      .select([
        'a_users.id',
        'a_users.name',
        'a_users.date_name',
        'a_users.image_path',
      ])
      .leftJoinAndSelect('a_users.week_id', 'week_id')
      .where('a_users.id = :id', { id: u })
      .getOne();
  }
}
