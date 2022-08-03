import { GenderInterface } from '../../gender/interfaces/gender.interface';
import { EntityRepository, Repository } from 'typeorm';
import { Gender } from '../entity/gender.entity';

@EntityRepository(Gender)
export class GenderRepository extends Repository<Gender> {
  async getAllGenders(): Promise<GenderInterface[]> {
    const genders = await this.createQueryBuilder('a_genders').getMany();

    return genders;
  }
}
