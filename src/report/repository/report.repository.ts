import { Reported } from '../entity/report.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Reported)
export class ReportedRepository extends Repository<Reported> {
  async getReportedUsersCount() {
    return await this.createQueryBuilder('a_user_reported').getCount();
  }
}
