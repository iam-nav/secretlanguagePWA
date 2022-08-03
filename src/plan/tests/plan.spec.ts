import { Test } from '@nestjs/testing';
import { PlanService } from '../plan.service';

describe('Plan', () => {
  let service: PlanService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: PlanService,
          useValue: {},
        },
      ],
    }).compile();

    service = moduleRef.get<PlanService>(PlanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
