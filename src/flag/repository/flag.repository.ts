import { Flagged } from '../entity/flag.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Flagged)
export class FlaggedRepository extends Repository<Flagged> {}
