import { Test } from '@nestjs/testing';
import { ShareReported } from '../entity/report.share.entity';
import { reportedShareService } from '../report.share.service';

describe('Relationship', () => {
  let service: reportedShareService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: reportedShareService,
          useValue: {},
        },
      ],
    }).compile();

    service = moduleRef.get<reportedShareService>(ShareReported);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
