import { Test } from '@nestjs/testing';
import { SeasonService } from '../season.service';

describe('Season', () => {
  let service: SeasonService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: SeasonService,
          useValue: {},
        },
      ],
    }).compile();

    service = moduleRef.get<SeasonService>(SeasonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
