import { EntityRepository, Repository } from 'typeorm';
import { Season } from '../entity/season.entity';

@EntityRepository(Season)
export class SeasonRepository extends Repository<Season> {}
