import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RelationshipController } from './relationship.controller';
import { RelationshipService } from './relationship.service';
import { RelationshipRepository } from './repository/relationship.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RelationshipRepository])],
  controllers: [RelationshipController],
  providers: [RelationshipService],
})
export class RelationshipModule {}
