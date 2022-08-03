import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WayRepository } from './repository/way.repository';
import { WayService } from './way.service';

@Module({
  imports: [TypeOrmModule.forFeature([WayRepository])],
  providers: [WayService],
})
export class WayModule {}
