import { Get } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { GendersSW } from '../swagger.response';
import { GenderService } from './gender.service';
import { GenderInterface } from './interfaces/gender.interface';

@Controller('genders')
export class GenderController {
  constructor(private genderService: GenderService) {}

  @Get()
  @ApiCreatedResponse({ type: [GendersSW] })
  async getGenders(): Promise<GenderInterface[]> {
    return this.genderService.getAllGenders();
  }
}
