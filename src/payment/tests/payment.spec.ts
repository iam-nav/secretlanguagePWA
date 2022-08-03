import { Test } from '@nestjs/testing';
import { PaymentController } from '../payment.controller';
import { PaymentService } from '../payment.service';

describe('Payment', () => {
  let controller: PaymentController;
  let service: PaymentService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [
        {
          provide: PaymentService,
          useValue: {},
        },
      ],
    }).compile();

    service = moduleRef.get<PaymentService>(PaymentService);
    controller = moduleRef.get<PaymentController>(PaymentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
});
