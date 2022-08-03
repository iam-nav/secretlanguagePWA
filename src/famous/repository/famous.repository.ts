import { EntityRepository, Repository } from 'typeorm';
import { Famous } from '../entity/famous.entity';

@EntityRepository(Famous)
export class FamousRepository extends Repository<Famous> {}
