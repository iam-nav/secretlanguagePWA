import { Controller, Get } from '@nestjs/common';
import { GetIdealForTagsInterface } from './interfaces/getIdealFortags.interface';
import { RelationshipService } from './relationship.service';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { IdealForTags } from '../swagger.response';

@Controller('relationship')
export class RelationshipController {
  constructor(private relationshipService: RelationshipService) {}

  @Get('getIdealForTags')
  @ApiCreatedResponse({ type: IdealForTags })
  async getIdealForTags(): Promise<GetIdealForTagsInterface[]> {
    return this.relationshipService.getIdealForTags();
  }
}
