import { Test } from '@nestjs/testing';
import { ReportedService } from '../report.service';

describe('Relationship', () => {
  let service: ReportedService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: ReportedService,
          useValue: {},
        },
      ],
    }).compile();

    service = moduleRef.get<ReportedService>(ReportedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
