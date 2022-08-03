import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilterService } from './filter.service';
import { FilterRepository } from './repository/filter.repository';

@Module({
  imports: [TypeOrmModule.forFeature([FilterRepository])],
  providers: [FilterService],
})
export class FilterModule {}
