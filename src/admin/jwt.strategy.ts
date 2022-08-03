import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import * as config from 'config';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminJWTPayload } from './interfaces/admin-jwt-payload.interface';
import { AdminRepository } from './repository/admin.repository';
import { Request } from 'express';

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, 'admin') {
  constructor(
    @InjectRepository(AdminRepository)
    private adminRepository: AdminRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) =>
          request.headers &&
          request.headers.authorization &&
          request.headers.authorization.split(' ')[1],
      ]),
      secretOrKey:
        process.env.ADMIN_JWT_SECRET || config.get('jwt.admin_secret'),
    });
  }

  async validate(payload: AdminJWTPayload) {
    const { username } = payload;

    const admin = await this.adminRepository.findOne({
      where: { username },
    });

    if (!admin)
      throw new UnauthorizedException(
        'There is no admin with this credentials',
      );

    return admin;
  }
}
