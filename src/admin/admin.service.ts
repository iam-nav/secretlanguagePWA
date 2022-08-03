import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as async from 'async';
import * as moment from 'moment';
import { AdminSignInDto } from './dto/adminSignIn.dto';
import { AdminRepository } from './repository/admin.repository';
import { AdminJWTPayload } from './interfaces/admin-jwt-payload.interface';
import { Admin } from './entity/admin.entity';
import { UserImagesRepository } from '../auth/repository/user-images.repository';
import { ImageIdDto } from './dto/imageId.dto';
import { AWSService } from '../aws.service';
import {
  GetMe,
  GetNotifications,
  GlobalResponse,
  ManageUsers,
  SearchUsers,
  Token,
  UserProfile,
  UserResponse,
  UsersImages,
} from './swagger.response';
import { NotificationService } from '../notification.service';
import { AdminNotificationsRepository } from './repository/admin-notification.repository';
import { User } from '../auth/entity/user.entity';
import { UserService } from '../auth/user.service';
import { SearchUsersDto } from './dto/searchUsers.dto';
import { UserRepository } from '../auth/repository/user.repository';
import { AdminRecentSearch } from './entity/admin-search.entity';
import { PaymentRepository } from '../payment/repository/payment.repository';
import { ReportedRepository } from '../report/repository/report.repository';
import { AddDeviceTokenDto } from './dto/addDeviceToken.dto';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminRepository) private adminRepository: AdminRepository,
    @InjectRepository(UserImagesRepository)
    private userImagesRepository: UserImagesRepository,
    @InjectRepository(AdminNotificationsRepository)
    private adminNotificationsRepository: AdminNotificationsRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(PaymentRepository)
    private paymentRepository: PaymentRepository,
    @InjectRepository(ReportedRepository)
    private reportedRepository: ReportedRepository,
    private jwtService: JwtService,
    private awsService: AWSService,
    private notificationService: NotificationService,
    private userService: UserService,
  ) {}

  async signUp(body: AdminSignInDto): Promise<Token> {
    const { username, password } = body;

    const hash = await bcrypt.hashSync(password, bcrypt.genSaltSync(10));

    try {
      const admin = this.adminRepository.create({ username, password: hash });
      await admin.save();

      const payload: AdminJWTPayload = {
        username: admin.username,
      };

      const token = this.jwtService.sign(payload);

      return { token };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async signIn(body: AdminSignInDto): Promise<Token> {
    const { username, password } = body;

    const admin: Admin = await this.adminRepository.findOne({
      where: { username },
      select: ['username', 'password'],
    });

    if (!admin)
      throw new NotFoundException('There is no admin with this credentials');

    const compare = bcrypt.compareSync(password, admin.password);

    if (!compare) throw new BadRequestException('Invalid password');

    const payload: AdminJWTPayload = {
      username: admin.username,
    };

    const token = this.jwtService.sign(payload);

    return {
      token,
    };
  }

  async getUsersImages(page: number): Promise<UsersImages[]> {
    const take = 20;
    if (!page || isNaN(page) || page < 1) page = 1;

    let images: any = await this.userImagesRepository
      .createQueryBuilder('a_user_images')
      .select([
        'a_user_images.id',
        'a_user_images.image',
        'a_user_images.is_profile_pic',
        'user.id',
        'user.name',
        'user.date_name',
      ])
      .leftJoin('a_user_images.user', 'user')
      .orderBy('a_user_images.id', 'DESC')
      .skip(take * (Number(page) - 1))
      .take(take)
      .getMany();

    images = await async.map(images, async (i) => {
      return {
        id: i.id,
        image: i.image,
        is_profile_pic: i.is_profile_pic,
        name: i.user.name,
        age: moment().diff(
          moment(i.user.date_name, 'MMM DD, YYYY').format('YYYY-MM-DD'),
          'years',
        ),
        userId: i.user.id,
      };
    });

    return images;
  }

  async rejectImage(body: ImageIdDto): Promise<GlobalResponse> {
    const { id } = body;

    const checkImage = await this.userImagesRepository
      .createQueryBuilder('a_user_images')
      .select([
        'a_user_images.id',
        'a_user_images.image',
        'a_user_images.is_profile_pic',
        'user.id',
        'user.device_token',
        'user.date_name',
      ])
      .where('a_user_images.id = :id', { id })
      .leftJoin('a_user_images.user', 'user')
      .getOne();

    if (!checkImage)
      throw new NotFoundException('There is no image with this id');

    const path = checkImage.image.split(process.env.IMAGE_KIT)[1].split('?')[0];
    if (path !== 'default.png') {
      this.awsService.deleteFile(`user/${path}`);
      console.log('Image deleted');
      await checkImage.remove();
    }

    const { user } = checkImage;

    if (checkImage.is_profile_pic) {
      const img = await this.userImagesRepository
        .createQueryBuilder('a_user_images')
        .orderBy('id', 'DESC')
        .where('a_user_images.user = :userId', { userId: user.id })
        .getOne();

      if (img) {
        img.is_profile_pic = true;
        user.hasProfilePicture = true;
        await user.save();
        await img.save();
      } else {
        user.hasProfilePicture = false;
        await user.save();
      }
    } else {
      user.hasProfilePicture = true;
      await user.save();
    }

    if (user.device_token !== '')
      this.notificationService.sendNotification(
        'Image deleted by admin',
        'One of your images has been deleted by administrator due to reported by several people. You can upload new images.',
        user.device_token,
        'open.profile',
      );

    return {
      status: 'success',
      message: 'The image was successfully deleted',
    };
  }

  async getNotifications(page: number): Promise<GetNotifications[]> {
    const take = 15;
    if (!page || isNaN(page) || page < 1) page = 1;

    let notifications: any = await this.adminNotificationsRepository
      .createQueryBuilder('a_admin_notifications')
      .select([
        'a_admin_notifications.id',
        'a_admin_notifications.type',
        'a_admin_notifications.message',
        'a_admin_notifications.createdAt',
        'user.id',
        'user.name',
        'user.date_name',
      ])
      .orderBy('a_admin_notifications.id', 'DESC')
      .leftJoin('a_admin_notifications.user', 'user')
      .leftJoinAndSelect('a_admin_notifications.image', 'image')
      .skip(take * (Number(page) - 1))
      .take(take)
      .getMany();

    notifications = await async.map(notifications, async (n) => {
      if (n.image) {
        return {
          ...n,
          user: {
            id: n.user.id,
            name: n.user.name,
            image: n.user.image.replace('?tr=w-600,h-600', '?tr=w-50,h-50'),
          },
          image: {
            ...n.image,
            image: n.image.image.replace('?tr=w-600,h-600', '?tr=w-100,h-100'),
            name: n.user.name,
            age: moment().diff(
              moment(n.user.date_name, 'MMM DD, YYYY').format('YYYY-MM-DD'),
              'years',
            ),
            userId: n.user.id,
          },
          createdAt: moment(n.createdAt).fromNow(),
        };
      } else {
        return {
          ...n,
          user: {
            id: n.user.id,
            name: n.user.name,
            image: n.user.image.replace('?tr=w-600,h-600', '?tr=w-50,h-50'),
          },
          createdAt: moment(n.createdAt).fromNow(),
        };
      }
    });

    return notifications;
  }

  async manageUserProfile(userId: number): Promise<ManageUsers> {
    if (!userId || isNaN(userId) || userId < 1) {
      throw new BadRequestException('Please provide user id');
    }

    const user: User = await User.findOne(userId, {
      select: ['id', 'name', 'date_name', 'is_banned'],
    });

    if (!user) throw new NotFoundException('There is no user with this id');

    const { friends, pending, requests } =
      await this.userService.friendsRequestsCounts(user);

    return {
      id: user.id,
      name: user.name,
      age: moment().diff(
        moment(user.date_name, 'MMM DD, YYYY').format('YYYY-MM-DD'),
        'years',
      ),
      image: user.image,
      banned: user.is_banned,
      friends,
      pending,
      requests,
    };
  }

  async userProfile(userId: number): Promise<UserProfile> {
    if (!userId || isNaN(userId) || userId < 1) {
      throw new BadRequestException('Please provide user id');
    }

    const user: User = await User.findOne(userId, {
      select: [
        'id',
        'name',
        'country_code',
        'phone_number',
        'is_verified',
        'user_type',
        'date_name',
        'instagram',
        'gender_preference',
        'country_name',
        'city',
        'attractive',
      ],
      relations: ['images', 'gender', 'interested_in'],
    });

    if (!user) throw new NotFoundException('There is no user with this id');

    const address = user.city
      ? `${user.city}, ${
          user.country_name === 'United States of America'
            ? 'US'
            : user.country_name
        }`
      : user.country_name;

    const images = user.images
      .sort(function (x, y) {
        return x.is_profile_pic === y.is_profile_pic ? 0 : x ? -1 : 1;
      })
      .map((img) => {
        return {
          ...img,
          name: user.name,
          age: moment().diff(
            moment(user.date_name, 'MMM DD, YYYY').format('YYYY-MM-DD'),
            'years',
          ),
          userId: user.id,
        };
      });

    return {
      id: user.id,
      images:
        images.length !== 0
          ? images
          : [
              {
                id: 0,
                image: `${process.env.IMAGE_KIT}default.png?tr=w-600,h-600`,
                is_profile_pic: true,
                name: user.name,
                age: moment().diff(
                  moment(user.date_name, 'MMM DD, YYYY').format('YYYY-MM-DD'),
                  'years',
                ),
                userId: user.id,
              },
            ],
      name: user.name,
      date_name: user.date_name,
      phone_number: `+${user.country_code}${user.phone_number}`,
      instagram: user.instagram,
      is_verified: user.is_verified,
      vip: user.user_type === 1 ? false : true,
      gender: user.gender,
      gender_preference: user.gender_preference,
      interested_in: user.interested_in,
      address: address,
      attractive: user.attractive,
    };
  }

  async updateUserProfile(
    userId: number,
    body: UpdateUserDto,
  ): Promise<UserProfile> {
    if (!userId || isNaN(userId) || userId < 1) {
      throw new BadRequestException('Please provide user id');
    }

    const user: User = await User.findOne(userId, {
      select: ['id', 'is_verified', 'attractive', 'user_type'],
    });

    if (!user) throw new NotFoundException('There is no user with this id');

    const { attractive, is_verified, vip } = body;

    user.attractive = attractive;
    user.is_verified = is_verified;

    if (vip) {
      user.user_type = 2;
      user.vip_by_admin = true;
    } else {
      user.user_type = 1;
      user.vip_by_admin = false;
    }

    await user.save();

    return await this.userProfile(userId);
  }

  async blockUser(userId: number): Promise<GlobalResponse> {
    if (!userId || isNaN(userId) || userId < 1) {
      throw new BadRequestException('Please provide user id');
    }

    const user: User = await User.findOne(userId, {
      select: ['id', 'name', 'date_name', 'device_token'],
    });

    if (!user) throw new NotFoundException('There is no user with this id');

    user.is_banned = true;
    await user.save();

    if (user.device_token !== '')
      this.notificationService.sendNotification(
        'Your account blocked',
        'Your account blocked by administrator due to reported by several people.😕',
        user.device_token,
      );

    return {
      status: 'success',
      message: 'User blocked',
    };
  }

  async unBlockUser(userId: number): Promise<GlobalResponse> {
    if (!userId || isNaN(userId) || userId < 1) {
      throw new BadRequestException('Please provide user id');
    }

    const user: User = await User.findOne(userId, {
      select: ['id', 'name', 'date_name', 'device_token'],
    });

    if (!user) throw new NotFoundException('There is no user with this id');

    user.is_banned = false;
    await user.save();

    if (user.device_token !== '')
      this.notificationService.sendNotification(
        'Your account unblocked',
        'Your account unblocked by administrator 🥳',
        user.device_token,
      );

    return {
      status: 'success',
      message: 'User unblocked',
    };
  }

  async searchUsers(
    body: SearchUsersDto,
    page: number,
  ): Promise<SearchUsers[]> {
    const take = 20;
    if (!page || isNaN(page) || page < 1) page = 1;
    const { input } = body;

    let users: any = await this.userRepository
      .createQueryBuilder('a_users')
      .select(['a_users.id', 'a_users.name', 'a_users.date_name'])
      .where('LOWER(a_users.name) LIKE LOWER(:input)', { input: `${input}%` })
      .orderBy('a_users.id', 'DESC')
      .skip(take * (Number(page) - 1))
      .take(take)
      .getMany();

    users = users.map((u) => {
      return {
        id: u.id,
        name: u.name,
        age: moment().diff(
          moment(u.date_name, 'MMM DD, YYYY').format('YYYY-MM-DD'),
          'years',
        ),
        image: u.image.replace('?tr=w-600,h-600', '?tr=w-50,h-50'),
      };
    });

    return users;
  }

  async getRecentSearch(admin: Admin): Promise<SearchUsers[]> {
    let recentSearchs: any = await AdminRecentSearch.find({
      where: { admin: admin.id },
      relations: ['user'],
      take: 10,
      order: {
        updatedAt: 'DESC',
        id: 'DESC',
      },
    });

    recentSearchs = await async.map(recentSearchs, async (r) => {
      return {
        id: r.user.id,
        name: r.user.name,
        age: moment().diff(
          moment(r.user.date_name, 'MMM DD, YYYY').format('YYYY-MM-DD'),
          'years',
        ),
        image: r.user.image.replace('?tr=w-600,h-600', '?tr=w-50,h-50'),
      };
    });

    return recentSearchs;
  }

  async addRecentSearch(admin: Admin, userId: number): Promise<GlobalResponse> {
    if (!userId || isNaN(userId) || userId < 1) {
      throw new BadRequestException('Please provide user id');
    }

    const user: User = await User.findOne(userId, {
      select: ['id'],
    });

    if (!user) throw new NotFoundException('There is no user with this id');

    const checkRecentSearch = await AdminRecentSearch.findOne({
      where: { admin: admin.id, user: user.id },
    });

    if (!checkRecentSearch) {
      await AdminRecentSearch.insert({
        admin: () => `${Number(admin.id)}`,
        user: () => `${Number(user.id)}`,
      });
    } else {
      checkRecentSearch.updatedAt = new Date(Date.now());
      await checkRecentSearch.save();
    }

    return {
      status: 'success',
      message: 'Recent user has added',
    };
  }

  async removeRecentSearch(userId: number): Promise<GlobalResponse> {
    if (!userId || isNaN(userId) || userId < 1) {
      throw new BadRequestException('Please provide user id');
    }

    const user: User = await User.findOne(userId, {
      select: ['id'],
    });

    if (!user) throw new NotFoundException('There is no user with this id');

    await AdminRecentSearch.delete({ user });

    return {
      status: 'success',
      message: 'Recent user has deleted',
    };
  }

  async getMe(admin: Admin): Promise<GetMe> {
    const [
      usersCount,
      womanCount,
      manCount,
      paymentsAmount,
      bannedUsersCount,
      reportedUsersCount,
    ] = await Promise.all([
      await this.userRepository.getUsersCount(),
      await this.userRepository.getWomanCount(),
      await this.userRepository.getManCount(),
      await this.paymentRepository.getPaymentsAmout(),
      await this.userRepository.getBannedUsersCount(),
      await this.reportedRepository.getReportedUsersCount(),
    ]);

    return {
      id: admin.id,
      username: admin.username,
      image: admin.image,
      usersCount,
      womanCount,
      manCount,
      reportsAmount: `$${paymentsAmount.reportsAmount}`,
      monthlyAmount: `$${paymentsAmount.monthlyAmount}`,
      amount: `$${paymentsAmount.amount}`,
      bannedUsersCount,
      reportedUsersCount,
    };
  }

  async addDeviceToken(
    admin: Admin,
    body: AddDeviceTokenDto,
  ): Promise<GlobalResponse> {
    const { device_token } = body;

    if (!device_token) {
      return {
        status: 'success',
        message: 'Device token was not found',
      };
    }

    admin.device_token = device_token;
    await admin.save();

    return {
      status: 'success',
      message: 'Device token was successfully added',
    };
  }

  async getBannedUsers(page: number): Promise<UserResponse[]> {
    const take = 15;
    if (!page || isNaN(page) || page < 1) page = 1;

    const users: any = await this.userRepository
      .createQueryBuilder('a_users')
      .where('a_users.is_banned = true')
      .select(['a_users.id', 'a_users.name', 'a_users.date_name'])
      .orderBy('a_users.id', 'DESC')
      .skip(take * (Number(page) - 1))
      .take(take)
      .getMany();

    return users;
  }

  async getReportedUsers(page: number): Promise<UserResponse[]> {
    const take = 15;
    if (!page || isNaN(page) || page < 1) page = 1;

    let users: any = await this.reportedRepository
      .createQueryBuilder('a_user_reported')
      .select([
        'a_user_reported.id',
        'reported_to.id',
        'reported_to.name',
        'reported_to.date_name',
      ])
      .leftJoin('a_user_reported.reported_to', 'reported_to')
      .orderBy('a_user_reported.id', 'DESC')
      .skip(take * (Number(page) - 1))
      .take(take)
      .getMany();

    users = await async.map(users, async (r: any) => {
      return r.reported_to;
    });

    return users;
  }

  async logout(admin: Admin): Promise<GlobalResponse> {
    admin.device_token = '';
    await admin.save();

    return {
      status: 'success',
      message: 'You are logged out',
    };
  }
}
