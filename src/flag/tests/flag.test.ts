import { Test } from '@nestjs/testing';
import { FlaggedService } from '../flag.service';

describe('Relationship', () => {
  let service: FlaggedService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: FlaggedService,
          useValue: {},
        },
      ],
    }).compile();

    service = moduleRef.get<FlaggedService>(FlaggedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
