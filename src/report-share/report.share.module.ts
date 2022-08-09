import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { reportedShareService } from './report.share.service';
import { ShareReportedRepository } from './repository/report.share.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ShareReportedRepository])],
  providers: [reportedShareService],
})
export class ShareReportedModule {}
