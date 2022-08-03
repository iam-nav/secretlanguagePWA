import { WayRepository } from './../way/repository/way.repository';
import { WeekRepository } from './../week/repository/week.repository';
import { UserService } from './user.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserRepository } from './repository/user.repository';
import { DateRepository } from '../date/repository/date.repository';
import { FilterRepository } from '../filter/repository/filter.repository';
import { JwtStrategy } from './jwt.strategy';
import { UserLeftSwipesRepository } from './repository/user-left-swipes.repository';
import { UserController } from './user.controller';
import * as config from 'config';
import { RelationshipRepository } from '../relationship/repository/relationship.repository';
import { UserFriendRequestsRepository } from './repository/user-friend-requests.repository';
import { PusherService } from '../pusher.service';
import { ReportedRepository } from '../report/repository/report.repository';
import { BlockedRepository } from '../block/repository/block.repository';
import { AWSService } from '../aws.service';
import { UserUnlockedBirthdaysRepository } from './repository/user-unlocked-birthdays.repository';
import { UserUnlockedRelationshipsRepository } from './repository/user-unlocked-relationships.repository';
import { PathRepository } from '../path/repository/path.repository';
import { HelperService } from '../helper.service';
import { NotificationService } from '../notification.service';
import { FlaggedRepository } from '../flag/repository/flag.repository';
import { ChatRepository } from '../chat/repository/chat.repository';
import { ChatService } from '../chat/chat.service';
import { MessageRepository } from '../chat/repository/message.repository';
import { MessageService } from '../message.service';
import { TwilioModule } from 'nestjs-twilio';
import { UserImages } from './entity/user-images.entity';
import { AdminNotificationsRepository } from '../admin/repository/admin-notification.repository';
import { AdminNotificationService } from '../admin/notification.service';
import { CitiesRepository } from '../cities/repository/cities.repository';
import { ScheduleModule } from '@nestjs/schedule';
import { SeasonRepository } from '../season/repository/season.repository';
import { DayRepository } from '../day/repository/day.repository';
import { MonthRepository } from '../month/repository/month.repository';

const jwtConfig = config.get('jwt');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || jwtConfig.secret,
      signOptions: {
        expiresIn: jwtConfig.expiresIn,
      },
    }),
    TypeOrmModule.forFeature([
      UserRepository,
      UserImages,
      UserLeftSwipesRepository,
      UserFriendRequestsRepository,
      DateRepository,
      FilterRepository,
      RelationshipRepository,
      WeekRepository,
      WayRepository,
      PathRepository,
      SeasonRepository,
      DayRepository,
      MonthRepository,
      ReportedRepository,
      BlockedRepository,
      FlaggedRepository,
      UserUnlockedBirthdaysRepository,
      UserUnlockedRelationshipsRepository,
      ChatRepository,
      MessageRepository,
      AdminNotificationsRepository,
      CitiesRepository,
    ]),
    TwilioModule.forRoot({
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
    }),
  ],
  controllers: [AuthController, UserController],
  providers: [
    JwtStrategy,
    AuthService,
    UserService,
    ChatService,
    PusherService,
    MessageService,
    AWSService,
    HelperService,
    NotificationService,
    AdminNotificationService,
  ],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
