import { Test } from '@nestjs/testing';
import { ChatController } from '../chat.controller';
import { ChatService } from '../chat.service';

describe('Chat', () => {
  let controller: ChatController;
  let service: ChatService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [
        {
          provide: ChatService,
          useValue: {},
        },
      ],
    }).compile();

    service = moduleRef.get<ChatService>(ChatService);
    controller = moduleRef.get<ChatController>(ChatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
});
