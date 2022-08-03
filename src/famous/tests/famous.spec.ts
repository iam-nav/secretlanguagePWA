import { Test } from '@nestjs/testing';
import { FamousService } from '../famous.service';

describe('Famous', () => {
  let service: FamousService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: FamousService,
          useValue: {},
        },
      ],
    }).compile();

    service = moduleRef.get<FamousService>(FamousService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
