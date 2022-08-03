import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlaggedService } from './flag.service';
import { FlaggedRepository } from './repository/flag.repository';

@Module({
  imports: [TypeOrmModule.forFeature([FlaggedRepository])],
  providers: [FlaggedService],
})
export class FlaggedModule {}
