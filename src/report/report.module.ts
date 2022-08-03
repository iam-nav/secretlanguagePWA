import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportedService } from './report.service';
import { ReportedRepository } from './repository/report.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ReportedRepository])],
  providers: [ReportedService],
})
export class ReportedModule {}
