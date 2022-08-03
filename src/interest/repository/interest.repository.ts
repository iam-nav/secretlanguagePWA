import { EntityRepository, Repository } from 'typeorm';
import { Interest } from '../entity/interest.entity';
import { InterestInterface } from '../interfaces/interest.interface';

@EntityRepository(Interest)
export class InterestRepository extends Repository<Interest> {
  async getAllInterests(): Promise<InterestInterface[]> {
    const interests = await this.createQueryBuilder('a_interests').getMany();

    return interests;
  }
}
