import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CitiesController } from './cities.controller';
import { CitiesService } from './cities.service';
import { CitiesRepository } from './repository/cities.repository';
import { JwtStrategy } from '../auth/jwt.strategy';
import { UserRepository } from '../auth/repository/user.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forFeature([CitiesRepository, UserRepository]),
  ],
  controllers: [CitiesController],
  providers: [JwtStrategy, CitiesService],
})
export class CitiesModule {}
