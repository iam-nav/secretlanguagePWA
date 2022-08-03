import { Test } from '@nestjs/testing';
import { FilterService } from '../filter.service';

describe('Filter', () => {
  let service: FilterService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: FilterService,
          useValue: {},
        },
      ],
    }).compile();

    service = moduleRef.get<FilterService>(FilterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
