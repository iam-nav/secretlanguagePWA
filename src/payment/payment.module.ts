import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PaymentRepository } from './repository/payment.repository';
import { AppleService } from '../apple.service';
import { UserUnlockedBirthdaysRepository } from '../auth/repository/user-unlocked-birthdays.repository';
import { UserUnlockedRelationshipsRepository } from '../auth/repository/user-unlocked-relationships.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forFeature([
      PaymentRepository,
      UserUnlockedBirthdaysRepository,
      UserUnlockedRelationshipsRepository,
    ]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService, AppleService],
})
export class PaymentModule {}
