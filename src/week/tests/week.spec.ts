import { Test } from '@nestjs/testing';
import { WeekService } from '../week.service';

describe('Week', () => {
  let service: WeekService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: WeekService,
          useValue: {},
        },
      ],
    }).compile();

    service = moduleRef.get<WeekService>(WeekService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
