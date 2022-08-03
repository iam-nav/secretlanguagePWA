import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GenderRepository } from './repository/gender.repository';
import { GenderInterface } from './interfaces/gender.interface';

@Injectable()
export class GenderService {
  constructor(
    @InjectRepository(GenderRepository)
    private genderRepository: GenderRepository,
  ) {}

  async getAllGenders(): Promise<GenderInterface[]> {
    return this.genderRepository.getAllGenders();
  }
}
