import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FamousService } from './famous.service';
import { FamousRepository } from './repository/famous.repository';

@Module({
  imports: [TypeOrmModule.forFeature([FamousRepository])],
  providers: [FamousService],
})
export class FamousModule {}
