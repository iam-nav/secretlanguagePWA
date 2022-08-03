import { EntityRepository, Repository } from 'typeorm';
import { Plan } from '../entity/plan.entity';

@EntityRepository(Plan)
export class PlanRepository extends Repository<Plan> {}
