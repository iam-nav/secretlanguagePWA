import { Module } from '@nestjs/common';
import { PlanService } from './plan.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanRepository } from './repository/plan.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PlanRepository])],
  providers: [PlanService],
})
export class PlanModule {}
