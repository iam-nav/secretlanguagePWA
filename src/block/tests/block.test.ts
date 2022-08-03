import { Test } from '@nestjs/testing';
import { BlockedService } from '../block.service';

describe('Relationship', () => {
  let service: BlockedService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: BlockedService,
          useValue: {},
        },
      ],
    }).compile();

    service = moduleRef.get<BlockedService>(BlockedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
