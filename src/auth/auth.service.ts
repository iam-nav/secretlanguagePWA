import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectTwilio, TwilioClient } from 'nestjs-twilio';
import { UserRepository } from './repository/user.repository';
import { SignUpDto } from './dto/sign-up.dto';
import { User } from './entity/user.entity';
import { CheckCodeDto } from './dto/check-code.dto';
import { NotFoundException } from '@nestjs/common';
import { GlobalResponse } from './interfaces/global-response.interface';
import { DateRepository } from '../date/repository/date.repository';
import { FilterRepository } from '../filter/repository/filter.repository';
import { SignInDto } from './dto/sign-in.dto';
import { TokenResponse } from './interfaces/token.interface';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { SignUpConfirmDto } from './dto/sign-up-confirm.dto';
import * as parsePhoneNumber from 'libphonenumber-js';
import * as moment from 'moment';
import * as iso from 'iso-3166-1';
import { MessageService } from '../message.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(DateRepository)
    private dateRepository: DateRepository,
    @InjectRepository(FilterRepository)
    private filterRepository: FilterRepository,
    @InjectTwilio() private readonly client: TwilioClient,
    private jwtService: JwtService,
    private messageService: MessageService,
  ) {}

  // Sign up user
  async signUp(body: SignUpDto): Promise<TokenResponse> {
    // Check if phone number starts with + or not
    if (!body.phoneNumber.startsWith('+'))
      if (parsePhoneNumber.isValidPhoneNumber('+1' + body.phoneNumber))
        body.phoneNumber = '+1' + body.phoneNumber;

    // Check phone number validation
    if (!parsePhoneNumber.isValidPhoneNumber(body.phoneNumber)) {
      throw new BadRequestException('Invalid phone number');
    }

    // Check birthday format
    if (!moment(body.birthday, 'MMM DD, YYYY').isValid()) {
      throw new BadRequestException('Invalid birthday');
    }

    // Get phone number international format object
    const phoneNumber = parsePhoneNumber.parsePhoneNumber(body.phoneNumber);
    // Change birthday format
    const birthday = moment(body.birthday, 'MMM DD, YYYY').format('MM/DD/YYYY');
    // Get fields from international phone number object
    const { number, country, countryCallingCode, nationalNumber } = phoneNumber;

    // Check if the user exists
    const user = await this.userRepository
      .createQueryBuilder('a_users')
      .where('a_users.phone_number = :phone_number', {
        phone_number: `${nationalNumber}`,
      })
      .getOne();

    if (user) {
      throw new BadRequestException(
        'There is a user with this phone number. Please log in or use another phone number',
      );
    }

    // Generate dob
    const y8_dob = Number(
      birthday.split('/')[2] + birthday.split('/')[0] + birthday.split('/')[1],
    );

    // Get date with dob from database
    const c_date = await this.dateRepository
      .createQueryBuilder('c_date')
      .leftJoinAndSelect('c_date.day_id', 'day_id')
      .leftJoinAndSelect('c_date.week_id', 'week_id')
      .leftJoinAndSelect('c_date.month_id', 'month_id')
      .leftJoinAndSelect('c_date.season_id', 'season_id')
      .where('c_date.y8 = :y8', { y8: y8_dob })
      .getOne();

    const date_name: string = c_date.date_name;
    const dob: number = c_date.y8;
    const sln: string = c_date.sln;
    const day_id: any = c_date.day_id.id;
    const week_id: any = c_date.week_id.id;
    const month_id: any = c_date.month_id.id;
    const season_id: any = c_date.season_id.id;
    const path_id: any = c_date.path_id;
    const way_id: any = c_date.way_id;

    // Get filters with week_id from database
    const c_filter = await this.filterRepository
      .createQueryBuilder('c_filter')
      .where('c_filter.id = :id', { id: week_id })
      .getOne();

    const friendship_filter: string = c_filter.friendship;
    const romance_filter: string = c_filter.romance;
    const business_filter: string = c_filter.business;
    const family_filter: string = c_filter.family;

    try {
      // Generate OTP
      const otp = String(Math.floor(100000 + Math.random() * 900000));
      // Set default gender and interest
      const gender: any = 1;
      const interested_in: any = 1;
      const gender_preference: any = 0;

      // Create user
      const user = await this.userRepository
        .createQueryBuilder('a_users')
        .insert()
        .into(User)
        .values([
          {
            country: `${country}`,
            country_name: `${iso.whereAlpha2(country).country}`,
            country_code: `${countryCallingCode}`,
            phone_number: `${nationalNumber}`,
            name: sln,
            otp,
            dob,
            day_id,
            week_id,
            month_id,
            season_id,
            way_id,
            path_id,
            sln,
            date_name,
            friendship_filter,
            romance_filter,
            business_filter,
            family_filter,
            gender,
            interested_in,
            gender_preference,
            age: moment().diff(
              moment(date_name, 'MMM DD, YYYY').format('YYYY-MM-DD'),
              'years',
            ),
          },
        ])
        .returning('*')
        .execute()
        .then((response) => response.raw[0]);

      try {
        await this.client.messages.create({
          body: `Your SL verification code is: ${otp}`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: `${number}`,
        });

        // Generate payload object
        const payload: JwtPayload = {
          id: user.id,
          username: user.username,
          phoneNumber: user.phone_number,
          country: user.country,
          country_code: user.country_code,
        };

        // Generate token
        const token = this.jwtService.sign(payload);

        return {
          id: user.id,
          username: user.username,
          token,
          interestedIn: interested_in,
          gender_preference: gender_preference,
        };
      } catch (e) {
        throw new BadRequestException(`We couldn't send SMS. Please try again`);
      }
    } catch (e) {
      if (e.message === "We couldn't send SMS. Please try again")
        throw new BadRequestException("We couldn't send SMS. Please try again");
      throw new BadRequestException('There is an error in the user creation.');
    }
  }

  // Check validation code
  async checkCode(body: CheckCodeDto): Promise<GlobalResponse> {
    // Check if phone number starts with + or not
    if (!body.phoneNumber.startsWith('+'))
      if (parsePhoneNumber.isValidPhoneNumber('+1' + body.phoneNumber))
        body.phoneNumber = '+1' + body.phoneNumber;

    // Check phone number validation
    if (!parsePhoneNumber.isValidPhoneNumber(body.phoneNumber)) {
      throw new BadRequestException('Invalid phone number');
    }

    // Get phone number international format object
    const phoneNumber = parsePhoneNumber.parsePhoneNumber(body.phoneNumber);
    // Get fields from international phone number object
    const { country, nationalNumber } = phoneNumber;

    // Check if the user exists
    const user = await this.userRepository
      .createQueryBuilder('a_users')
      .where(
        'a_users.phone_number = :phone_number AND a_users.country = :country',
        {
          phone_number: `${nationalNumber}`,
          country: `${country}`,
        },
      )
      .addSelect('a_users.otp')
      .getOne();

    if (!user) {
      throw new NotFoundException(
        'User not found. Please sign up and try again',
      );
    }

    // Check if user account was verified or not
    if (user.is_verified || user.otp === '') {
      throw new BadRequestException(
        'Your account has already been verified. Please log in.',
      );
    }

    // Check if otp is correct
    if (user.otp === body.otp) {
      try {
        // Verify user
        user.otp = '';
        user.is_verified = true;
        await user.save();

        return {
          status: 'success',
          message: 'Your OTP is correct',
        };
      } catch (e) {
        throw new BadRequestException('Something went wrong. Please try again');
      }
    } else {
      throw new BadRequestException(
        'Incorrect OTP. Please check and try again',
      );
    }
  }

  // Confirm sign up
  async signUpConfirm(
    user: User,
    body: SignUpConfirmDto,
  ): Promise<TokenResponse> {
    const { gender, interested_in, name, gender_preference } = body;

    try {
      // Update user
      user.gender = gender;
      user.interested_in = interested_in;
      user.name = name.trim();
      user.gender_preference = gender_preference ? gender_preference : 0;
      await user.save();

      // Generate payload
      const payload: JwtPayload = {
        id: user.id,
        username: user.username,
        phoneNumber: user.phone_number,
        country: user.country,
        country_code: user.country_code,
      };

      // Generate token
      const token = this.jwtService.sign(payload);

      return {
        id: user.id,
        username: user.username,
        token,
        interestedIn: interested_in,
        gender_preference: user.gender_preference,
      };
    } catch (e) {
      throw new NotFoundException(
        'User not found. Please sign up and try again',
      );
    }
  }

  // Sign in user
  async signIn(body: SignInDto): Promise<GlobalResponse> {
    // Check if phone number starts with + or not
    if (!body.phoneNumber.startsWith('+'))
      if (parsePhoneNumber.isValidPhoneNumber('+1' + body.phoneNumber))
        body.phoneNumber = '+1' + body.phoneNumber;

    // Check phone number validation
    if (!parsePhoneNumber.isValidPhoneNumber(body.phoneNumber)) {
      throw new BadRequestException('Invalid phone number');
    }

    const phoneNumber = parsePhoneNumber.parsePhoneNumber(body.phoneNumber);
    const { country, nationalNumber, number } = phoneNumber;

    const user = await this.userRepository
      .createQueryBuilder('a_users')
      .where(
        'a_users.phone_number = :phone_number AND a_users.country = :country',
        {
          phone_number: `${nationalNumber}`,
          country: `${country}`,
        },
      )
      .getOne();

    if (!user) {
      throw new NotFoundException(
        'User not found. Please sign up and try again',
      );
    }

    if (user.is_banned) {
      throw new NotFoundException('The user was banned');
    }

    try {
      const otp = String(Math.floor(100000 + Math.random() * 900000));
      user.otp = otp;
      await user.save();

      try {
        await this.client.messages.create({
          body: `Your SL verification code is: ${otp}`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: `${number}`,
        });

        return {
          status: 'success',
          message: `Your verification code was successfully sent to: ${number}`,
        };
      } catch (e) {
        console.log(e);
        throw new BadRequestException(`We couldn't send SMS. Please try again`);
      }
    } catch (e) {
      if (e.message === "We couldn't send SMS. Please try again")
        throw new BadRequestException("We couldn't send SMS. Please try again");
      throw new BadRequestException('There is an error. Please try again');
    }
  }

  // Check sign in code
  async checkSignInCode(body: CheckCodeDto): Promise<TokenResponse> {
    // Check if phone number starts with + or not
    if (!body.phoneNumber.startsWith('+'))
      if (parsePhoneNumber.isValidPhoneNumber('+1' + body.phoneNumber))
        body.phoneNumber = '+1' + body.phoneNumber;

    // Check phone number validation
    if (!parsePhoneNumber.isValidPhoneNumber(body.phoneNumber)) {
      throw new BadRequestException('Invalid phone number');
    }

    const phoneNumber = parsePhoneNumber.parsePhoneNumber(body.phoneNumber);
    const { country, nationalNumber } = phoneNumber;

    const user = await this.userRepository
      .createQueryBuilder('a_users')
      .leftJoinAndSelect('a_users.interested_in', 'interested_in')
      .where(
        'a_users.phone_number = :phone_number AND a_users.country = :country',
        {
          phone_number: `${nationalNumber}`,
          country: `${country}`,
        },
      )
      .addSelect('a_users.otp')
      .getOne();

    if (!user) {
      throw new NotFoundException(
        'User not found. Please sign up and try again',
      );
    }

    if (user.is_banned) {
      throw new NotFoundException('The user was banned');
    }

    if (user.otp === '') {
      throw new BadRequestException('You did not send a OTP');
    }

    if (user.otp === body.otp) {
      try {
        user.otp = '';
        user.is_verified = true;
        await user.save();
      } catch (e) {
        throw new BadRequestException('There is an error. Please try again');
      }

      const payload: JwtPayload = {
        id: user.id,
        username: user.username,
        phoneNumber: user.phone_number,
        country: user.country,
        country_code: user.country_code,
      };

      const token = this.jwtService.sign(payload);

      return {
        id: user.id,
        username: user.username,
        token,
        interestedIn: user.interested_in.id,
        gender_preference: user.gender_preference || 0,
      };
    } else {
      throw new BadRequestException(
        'Incorrect OTP. Please check and try again',
      );
    }
  }

  // Resend verification code
  async resendCode(body: SignInDto): Promise<GlobalResponse> {
    // Check if phone number starts with + or not
    if (!body.phoneNumber.startsWith('+'))
      if (parsePhoneNumber.isValidPhoneNumber('+1' + body.phoneNumber))
        body.phoneNumber = '+1' + body.phoneNumber;

    // Check phone number validation
    if (!parsePhoneNumber.isValidPhoneNumber(body.phoneNumber)) {
      throw new BadRequestException('Invalid phone number');
    }

    const phoneNumber = parsePhoneNumber.parsePhoneNumber(body.phoneNumber);
    const { country, nationalNumber, number } = phoneNumber;

    const user = await this.userRepository
      .createQueryBuilder('a_users')
      .where(
        'a_users.phone_number = :phone_number AND a_users.country = :country',
        {
          phone_number: `${nationalNumber}`,
          country: `${country}`,
        },
      )
      .getOne();

    if (!user) {
      throw new NotFoundException(
        'User not found. Please sign up and try again',
      );
    }

    if (user.is_banned) {
      throw new NotFoundException('The user was banned');
    }

    try {
      const otp = String(Math.floor(100000 + Math.random() * 900000));
      user.otp = otp;
      await user.save();

      try {
        await this.client.messages.create({
          body: `Your SL verification code is: ${otp}`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: `${number}`,
        });

        return {
          status: 'success',
          message: `Your verification code was successfully sent to: ${number}`,
        };
      } catch (e) {
        throw new BadRequestException(`We couldn't send SMS. Please try again`);
      }
    } catch (e) {
      if (e.message === "We couldn't send SMS. Please try again")
        throw new BadRequestException("We couldn't send SMS. Please try again");
      throw new BadRequestException('There is an error. Please try again');
    }
  }
}
