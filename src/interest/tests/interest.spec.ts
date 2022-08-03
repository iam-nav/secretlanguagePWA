import { Test } from '@nestjs/testing';
import { InterestController } from '../interest.controller';
import { InterestService } from '../interest.service';

describe('Interest', () => {
  let controller: InterestController;
  let service: InterestService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [InterestController],
      providers: [
        {
          provide: InterestService,
          useValue: {},
        },
      ],
    }).compile();

    service = moduleRef.get<InterestService>(InterestService);
    controller = moduleRef.get<InterestController>(InterestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
});
