import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import * as config from 'config';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UserRepository } from './repository/user.repository';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) =>
          request.headers &&
          request.headers.authorization &&
          request.headers.authorization.split(' ')[1],
      ]),
      secretOrKey: process.env.JWT_SECRET || config.get('jwt.secret'),
    });
  }

  async validate(payload: JwtPayload) {
    const { id, username, phoneNumber, country, country_code } = payload;

    const user = await this.userRepository
      .createQueryBuilder('a_users')
      .where(
        'a_users.id = :id AND a_users.username = :username AND a_users.phone_number = :phoneNumber AND a_users.country = :country AND a_users.country_code = :country_code',
        {
          id,
          username,
          phoneNumber,
          country,
          country_code,
        },
      )
      .leftJoinAndSelect('a_users.gender', 'gender')
      .leftJoinAndSelect('a_users.interested_in', 'interested_in')
      .leftJoinAndSelect('a_users.day_id', 'day')
      .leftJoinAndSelect('a_users.week_id', 'week_id')
      .leftJoinAndSelect('a_users.month_id', 'month_id')
      .leftJoinAndSelect('a_users.season_id', 'season_id')
      .leftJoinAndSelect('a_users.way_id', 'way_id')
      .leftJoinAndSelect('a_users.path_id', 'path_id')
      .getOne();

    if (!user)
      throw new UnauthorizedException('There is no user with this credentials');

    return user;
  }
}
