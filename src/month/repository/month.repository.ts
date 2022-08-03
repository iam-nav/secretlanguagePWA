import { EntityRepository, Repository } from 'typeorm';
import { Month } from '../entity/month.entity';

@EntityRepository(Month)
export class MonthRepository extends Repository<Month> {}
