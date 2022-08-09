import { ShareReported } from '../entity/report.share.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(ShareReported)
export class ShareReportedRepository extends Repository<ShareReported> {
  async getReportedUsersCount() {
    return await this.createQueryBuilder('a_share_report').getCount();
  }
}
