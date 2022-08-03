import { Test } from '@nestjs/testing';
import { RelationshipController } from '../relationship.controller';
import { RelationshipService } from '../relationship.service';

describe('Relationship', () => {
  let controller: RelationshipController;
  let service: RelationshipService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [RelationshipController],
      providers: [
        {
          provide: RelationshipService,
          useValue: {},
        },
      ],
    }).compile();

    service = moduleRef.get<RelationshipService>(RelationshipService);
    controller = moduleRef.get<RelationshipController>(RelationshipController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
});
