import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PathService } from './path.service';
import { PathRepository } from './repository/path.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PathRepository])],
  providers: [PathService],
})
export class PathModule {}
