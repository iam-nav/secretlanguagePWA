import { Module } from '@nestjs/common';
import { InterestService } from './interest.service';
import { InterestController } from './interest.controller';
import { InterestRepository } from './repository/interest.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([InterestRepository])],
  providers: [InterestService],
  controllers: [InterestController],
})
export class InterestModule {}
