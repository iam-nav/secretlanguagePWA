import { Test } from '@nestjs/testing';
import { GenderController } from '../gender.controller';
import { GenderService } from '../gender.service';

describe('Gender', () => {
  let controller: GenderController;
  let service: GenderService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [GenderController],
      providers: [
        {
          provide: GenderService,
          useValue: {},
        },
      ],
    }).compile();

    service = moduleRef.get<GenderService>(GenderService);
    controller = moduleRef.get<GenderController>(GenderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
});
