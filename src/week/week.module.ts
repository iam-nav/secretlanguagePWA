import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeekRepository } from './repository/week.repository';
import { WeekService } from './week.service';

@Module({
  imports: [TypeOrmModule.forFeature([WeekRepository])],
  providers: [WeekService],
})
export class WeekModule {}
