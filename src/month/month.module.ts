import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonthService } from './month.service';
import { MonthRepository } from './repository/month.repository';

@Module({
  imports: [TypeOrmModule.forFeature([MonthRepository])],
  providers: [MonthService],
})
export class MonthModule {}
