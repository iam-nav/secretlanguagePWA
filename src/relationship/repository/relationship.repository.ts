import { EntityRepository, Repository } from 'typeorm';
import { Relationship } from '../entity/relationship.entity';

@EntityRepository(Relationship)
export class RelationshipRepository extends Repository<Relationship> {}
