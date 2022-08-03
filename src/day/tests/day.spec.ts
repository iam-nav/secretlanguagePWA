import { Test } from '@nestjs/testing';
import { DayService } from '../day.service';

describe('Day', () => {
  let service: DayService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: DayService,
          useValue: {},
        },
      ],
    }).compile();

    service = moduleRef.get<DayService>(DayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
