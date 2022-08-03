import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockedService } from './block.service';
import { BlockedRepository } from './repository/block.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BlockedRepository])],
  providers: [BlockedService],
})
export class BlockedModule {}
