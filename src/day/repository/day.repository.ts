import { EntityRepository, Repository } from 'typeorm';
import { Day } from '../entity/day.entity';

@EntityRepository(Day)
export class DayRepository extends Repository<Day> {}
