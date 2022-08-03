import { EntityRepository, Repository } from 'typeorm';
import { Way } from '../entity/way.entity';

@EntityRepository(Way)
export class WayRepository extends Repository<Way> {}
