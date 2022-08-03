import { Test } from '@nestjs/testing';
import { PathService } from '../path.service';

describe('Path', () => {
  let service: PathService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: PathService,
          useValue: {},
        },
      ],
    }).compile();

    service = moduleRef.get<PathService>(PathService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
