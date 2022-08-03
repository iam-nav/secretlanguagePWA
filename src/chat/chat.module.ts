import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRepository } from './repository/chat.repository';
import { MessageRepository } from './repository/message.repository';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from '../auth/jwt.strategy';
import { HelperService } from '../helper.service';
import { UserRepository } from '../auth/repository/user.repository';
import { RelationshipRepository } from '../relationship/repository/relationship.repository';
import { PusherService } from '../pusher.service';
import { AWSService } from '../aws.service';
import { NotificationService } from '../notification.service';
import { BlockedRepository } from '../block/repository/block.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forFeature([
      ChatRepository,
      MessageRepository,
      UserRepository,
      RelationshipRepository,
      BlockedRepository,
    ]),
  ],
  controllers: [ChatController],
  providers: [
    JwtStrategy,
    ChatService,
    HelperService,
    PusherService,
    AWSService,
    NotificationService,
  ],
})
export class ChatModule {}
