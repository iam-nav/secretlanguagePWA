import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeasonRepository } from './repository/season.repository';
import { SeasonService } from './season.service';

@Module({
  imports: [TypeOrmModule.forFeature([SeasonRepository])],
  providers: [SeasonService],
})
export class SeasonModule {}
