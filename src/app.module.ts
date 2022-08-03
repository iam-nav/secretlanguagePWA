import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { GenderModule } from './gender/gender.module';
import { InterestModule } from './interest/interest.module';
import { PlanModule } from './plan/plan.module';
import { FamousModule } from './famous/famous.module';
import { DayModule } from './day/day.module';
import { FilterModule } from './filter/filter.module';
import { MonthModule } from './month/month.module';
import { PathModule } from './path/path.module';
import { RelationshipModule } from './relationship/relationship.module';
import { SeasonModule } from './season/season.module';
import { WayModule } from './way/way.module';
import { WeekModule } from './week/week.module';
import { DateModule } from './date/date.module';
import { ReportedModule } from './report/report.module';
import { BlockedModule } from './block/block.module';
import { ChatModule } from './chat/chat.module';
import { FlaggedModule } from './flag/flag.module';
import { ShareController } from './share.controller';
import { PaymentModule } from './payment/payment.module';
import { AdminModule } from './admin/admin.module';
import { CitiesModule } from './cities/cities.module';
import { ShareService } from './share.service';
import { DayRepository } from './day/repository/day.repository';
import { MonthRepository } from './month/repository/month.repository';
import { PathRepository } from './path/repository/path.repository';
import { SeasonRepository } from './season/repository/season.repository';
import { WayRepository } from './way/repository/way.repository';
import { WeekRepository } from './week/repository/week.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([
      DayRepository,
      MonthRepository,
      PathRepository,
      SeasonRepository,
      WayRepository,
      WeekRepository,
    ]),
    AuthModule,
    GenderModule,
    InterestModule,
    PlanModule,
    FamousModule,
    DayModule,
    FilterModule,
    MonthModule,
    PathModule,
    RelationshipModule,
    SeasonModule,
    WayModule,
    WeekModule,
    DateModule,
    ReportedModule,
    BlockedModule,
    FlaggedModule,
    ChatModule,
    PaymentModule,
    AdminModule,
    CitiesModule,
  ],
  controllers: [ShareController],
  providers: [ShareService],
})
export class AppModule {}
