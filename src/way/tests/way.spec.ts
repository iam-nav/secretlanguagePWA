import { Test } from '@nestjs/testing';
import { WayService } from '../way.service';

describe('Way', () => {
  let service: WayService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: WayService,
          useValue: {},
        },
      ],
    }).compile();

    service = moduleRef.get<WayService>(WayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
