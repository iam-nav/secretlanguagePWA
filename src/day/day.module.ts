import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DayService } from './day.service';
import { DayRepository } from './repository/day.repository';

@Module({
  imports: [TypeOrmModule.forFeature([DayRepository])],
  providers: [DayService],
})
export class DayModule {}
