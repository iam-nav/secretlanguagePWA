import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RelationshipRepository } from './repository/relationship.repository';
import * as async from 'async';
import { GetIdealForTagsInterface } from './interfaces/getIdealFortags.interface';

@Injectable()
export class RelationshipService {
  constructor(
    @InjectRepository(RelationshipRepository)
    private relationshipRepository: RelationshipRepository,
  ) {}

  async getIdealForTags(): Promise<GetIdealForTagsInterface[]> {
    const rel = await this.relationshipRepository
      .createQueryBuilder('relationship')
      .select(['relationship.ideal'])
      .getMany();

    const ideal = new Set();
    await async.map(rel, async (r: any) => {
      ideal.add(r.ideal);
    });

    const result = await async.map(
      Array.from(ideal.values()),
      async (i: any) => {
        return {
          name: i,
        };
      },
    );

    return result;
  }
}
