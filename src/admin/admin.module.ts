import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import * as config from 'config';
import { AdminRepository } from './repository/admin.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminJwtStrategy } from './jwt.strategy';
import { UserImagesRepository } from '../auth/repository/user-images.repository';
import { AWSService } from '../aws.service';
import { NotificationService } from '../notification.service';
import { AdminNotificationsRepository } from './repository/admin-notification.repository';
import { UserRepository } from '../auth/repository/user.repository';
import { UserService } from '../auth/user.service';
import { UserLeftSwipesRepository } from '../auth/repository/user-left-swipes.repository';
import { ChatRepository } from '../chat/repository/chat.repository';
import { FilterRepository } from '../filter/repository/filter.repository';
import { RelationshipRepository } from '../relationship/repository/relationship.repository';
import { DateRepository } from '../date/repository/date.repository';
import { WayRepository } from '../way/repository/way.repository';
import { PathRepository } from '../path/repository/path.repository';
import { UserFriendRequestsRepository } from '../auth/repository/user-friend-requests.repository';
import { ReportedRepository } from '../report/repository/report.repository';
import { BlockedRepository } from '../block/repository/block.repository';
import { FlaggedRepository } from '../flag/repository/flag.repository';
import { UserUnlockedBirthdaysRepository } from '../auth/repository/user-unlocked-birthdays.repository';
import { UserUnlockedRelationshipsRepository } from '../auth/repository/user-unlocked-relationships.repository';
import { PusherService } from '../pusher.service';
import { HelperService } from '../helper.service';
import { ChatService } from '../chat/chat.service';
import { MessageRepository } from '../chat/repository/message.repository';
import { AdminRecentSearchRepository } from './repository/admin-search.repository';
import { PaymentRepository } from '../payment/repository/payment.repository';
import { AdminNotificationService } from './notification.service';
import { CitiesRepository } from '../cities/repository/cities.repository';
import { SeasonRepository } from '../season/repository/season.repository';
import { WeekRepository } from '../week/repository/week.repository';
import { DayRepository } from '../day/repository/day.repository';
import { MonthRepository } from '../month/repository/month.repository';

const jwtConfig = config.get('jwt');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forFeature([
      AdminRepository,
      AdminRecentSearchRepository,
      UserRepository,
      UserLeftSwipesRepository,
      ChatRepository,
      FilterRepository,
      RelationshipRepository,
      DateRepository,
      WayRepository,
      PathRepository,
      SeasonRepository,
      WeekRepository,
      DayRepository,
      MonthRepository,
      UserFriendRequestsRepository,
      ReportedRepository,
      BlockedRepository,
      FlaggedRepository,
      UserUnlockedBirthdaysRepository,
      UserUnlockedRelationshipsRepository,
      MessageRepository,
      UserImagesRepository,
      AdminNotificationsRepository,
      PaymentRepository,
      CitiesRepository,
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.ADMIN_JWT_SECRET || jwtConfig.admin_secret,
      signOptions: {
        expiresIn: jwtConfig.expiresIn,
      },
    }),
  ],
  controllers: [AdminController],
  providers: [
    AdminService,
    UserService,
    AdminJwtStrategy,
    AWSService,
    NotificationService,
    AdminNotificationService,
    PusherService,
    HelperService,
    ChatService,
  ],
})
export class AdminModule {}
