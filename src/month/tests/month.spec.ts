import { Test } from '@nestjs/testing';
import { MonthService } from '../month.service';

describe('Month', () => {
  let service: MonthService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: MonthService,
          useValue: {},
        },
      ],
    }).compile();

    service = moduleRef.get<MonthService>(MonthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
