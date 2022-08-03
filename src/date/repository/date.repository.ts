import { EntityRepository, Repository } from 'typeorm';
import { Date } from '../entity/date.entity';

@EntityRepository(Date)
export class DateRepository extends Repository<Date> {}
