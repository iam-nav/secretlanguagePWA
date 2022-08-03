import { Controller, Get } from '@nestjs/common';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { InterestsSW } from '../swagger.response';
import { InterestInterface } from './interfaces/interest.interface';

@Controller('interests')
export class InterestController {
  @Get()
  @ApiCreatedResponse({ type: [InterestsSW] })
  getGenders(): InterestInterface[] {
    return [
      {
        id: 1,
        name: 'Romance',
        description: 'Find that spark in an emprowered community',
      },
      {
        id: 2,
        name: 'Friendship',
        description: 'Make new friends at every stage of your life',
      },
      {
        id: 3,
        name: 'Business',
        description: 'Move your career forward the modern way',
      },
    ];
  }
}
