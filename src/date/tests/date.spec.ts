import { Test } from '@nestjs/testing';
import { DateService } from '../date.service';

describe('Date', () => {
  let service: DateService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: DateService,
          useValue: {},
        },
      ],
    }).compile();

    service = moduleRef.get<DateService>(DateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
