import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InterestInterface } from './interfaces/interest.interface';
import { InterestRepository } from './repository/interest.repository';

@Injectable()
export class InterestService {
  constructor(
    @InjectRepository(InterestRepository)
    private interestRepository: InterestRepository,
  ) {}

  async getAllInterests(): Promise<InterestInterface[]> {
    return this.interestRepository.getAllInterests();
  }
}
