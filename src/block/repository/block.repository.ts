import { Blocked } from '../entity/block.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Blocked)
export class BlockedRepository extends Repository<Blocked> {}
