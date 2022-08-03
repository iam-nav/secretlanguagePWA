import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DateService } from './date.service';
import { DateRepository } from './repository/date.repository';

@Module({
  imports: [TypeOrmModule.forFeature([DateRepository])],
  providers: [DateService],
})
export class DateModule {}
