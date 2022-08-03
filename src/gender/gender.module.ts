import { Module } from '@nestjs/common';
import { GenderService } from './gender.service';
import { GenderController } from './gender.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenderRepository } from './repository/gender.repository';
import { UserRepository } from '../auth/repository/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([GenderRepository, UserRepository])],
  providers: [GenderService],
  controllers: [GenderController],
})
export class GenderModule {}
