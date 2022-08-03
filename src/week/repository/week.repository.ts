import { EntityRepository, Repository } from 'typeorm';
import { Week } from '../entity/week.entity';

@EntityRepository(Week)
export class WeekRepository extends Repository<Week> {}
