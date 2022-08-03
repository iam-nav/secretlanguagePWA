import { EntityRepository, Repository } from 'typeorm';
import { Filter } from '../entity/filter.entity';

@EntityRepository(Filter)
export class FilterRepository extends Repository<Filter> {}
