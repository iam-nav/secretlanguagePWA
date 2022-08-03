import { MyFriendsResponse } from './interfaces/my-friends.interface';
import { SearchUsersDto } from './dto/searchUsers.dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserLeftSwipesRepository } from './repository/user-left-swipes.repository';
import { UserLeftSwipes } from './entity/user-left-swipes.entity';
import { UserRepository } from './repository/user.repository';
import { AddUserLeftSwipeDto } from './dto/add-user-left-swipe.dto';
import { User } from './entity/user.entity';
import { GlobalResponse } from './interfaces/global-response.interface';
import { AddUserLocationDto } from './dto/addUserLocation.dto';
import { RelationshipRepository } from '../relationship/repository/relationship.repository';
import * as async from 'async';
import * as moment from 'moment';
import * as _ from 'lodash';
import { DateRepository } from '../date/repository/date.repository';
import { UserFriendRequestsRepository } from './repository/user-friend-requests.repository';
import { UserFriendRequests } from './entity/user-friend-requests.entity';
import { SendFriendRequestDto } from './dto/send-friend-request.dto';
import { FriendRequestStatus } from './enum/friend-request-status.enum';
import { FriendsRequestsCountsResponse } from './interfaces/friends-requests-counts.interface';
import { PusherService } from '../pusher.service';
import { ReportedRepository } from '../report/repository/report.repository';
import { Reported } from '../report/entity/report.entity';
import { ReportedDto } from './dto/report.dto';
import { BlockedRepository } from '../block/repository/block.repository';
import { Blocked } from '../block/entity/block.entity';
import { AWSService } from '../aws.service';
import { GetSuggestionsDto } from './dto/getSuggestionsDto.dto';
import { GetSuggestionsInterface } from './interfaces/get-suggestions.interface';
import { SearchAllUsersDto } from './dto/searchAllUsers.dto';
import { ShowBirthdayReportDto } from './dto/showBirthdayReport.dto';
import { UnlockedReportEnum } from './enum/unlocked-reports.enum';
import { UserUnlockedBirthdaysRepository } from './repository/user-unlocked-birthdays.repository';
import { UserUnlockedBirthdays } from './entity/user-unlocked-birthdays.entity';
import { ShowRelationshipReportDto } from './dto/showRelationshipReport.dto';
import { UserUnlockedRelationshipsRepository } from './repository/user-unlocked-relationships.repository';
import { UserUnlockedRelationships } from './entity/user-unlocked-relationships.entity';
import { WayRepository } from '../way/repository/way.repository';
import { PathRepository } from '../path/repository/path.repository';
import { HelperService } from '../helper.service';
import { GetMe } from './interfaces/get-me.interface';
import { GetUserProfileInterface } from './interfaces/get-user-profile.interface';
import { AddPaidReportDto } from './dto/addPaidReport.dto';
import {
  UnprocessableEntityException,
  ConflictException,
} from '@nestjs/common';
import { AddDeviceTokenDto } from './dto/addDeviceToken.dto';
import { NotificationService } from '../notification.service';
import { FlaggedRepository } from '../flag/repository/flag.repository';
import { Flagged } from '../flag/entity/flag.entity';
import { GetSettingsInterface } from './interfaces/get-settings.interface';
import { FilterRepository } from '../filter/repository/filter.repository';
import { UpdateUserDto } from './dto/updateUser.dto';
import { ChatRepository } from '../chat/repository/chat.repository';
import { Chat } from '../chat/entity/chat.entity';
import { ChatService } from '../chat/chat.service';
import { UserImagesRepository } from './repository/user-images.repository';
import { UserImages } from './entity/user-images.entity';
import { AdminNotificationsRepository } from 'src/admin/repository/admin-notification.repository';
import { AdminNotificationService } from '../admin/notification.service';
import { CitiesRepository } from '../cities/repository/cities.repository';
import { UpdateLocationDto } from './dto/updateLocation.dto';
import { SeasonRepository } from '../season/repository/season.repository';
import { WeekRepository } from '../week/repository/week.repository';
import { DayRepository } from '../day/repository/day.repository';
import { MonthRepository } from '../month/repository/month.repository';
import { SitemapStream, streamToPromise } from 'sitemap';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserLeftSwipesRepository)
    private userLeftSwipesRepository: UserLeftSwipesRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(UserImagesRepository)
    private userImagesRepository: UserImagesRepository,
    @InjectRepository(ChatRepository)
    private chatRepository: ChatRepository,
    @InjectRepository(FilterRepository)
    private filterRepository: FilterRepository,
    @InjectRepository(RelationshipRepository)
    private relationshipRepository: RelationshipRepository,
    @InjectRepository(DateRepository)
    private dateRepository: DateRepository,
    @InjectRepository(WeekRepository)
    private weekRepository: WeekRepository,
    @InjectRepository(DayRepository)
    private dayRepository: DayRepository,
    @InjectRepository(MonthRepository)
    private monthRepository: MonthRepository,
    @InjectRepository(WayRepository)
    private wayRepository: WayRepository,
    @InjectRepository(PathRepository)
    private pathRepository: PathRepository,
    @InjectRepository(UserFriendRequestsRepository)
    private userFriendRequestsRepository: UserFriendRequestsRepository,
    @InjectRepository(ReportedRepository)
    private reportedRepository: ReportedRepository,
    @InjectRepository(BlockedRepository)
    private blockedRepository: BlockedRepository,
    @InjectRepository(FlaggedRepository)
    private flaggedRepository: FlaggedRepository,
    @InjectRepository(UserUnlockedBirthdaysRepository)
    private userUnlockedBirthdaysRepository: UserUnlockedBirthdaysRepository,
    @InjectRepository(UserUnlockedRelationshipsRepository)
    private userUnlockedRelationshipsRepository: UserUnlockedRelationshipsRepository,
    @InjectRepository(AdminNotificationsRepository)
    private adminNotificationsRepository: AdminNotificationsRepository,
    @InjectRepository(CitiesRepository)
    private citiesRepository: CitiesRepository,
    @InjectRepository(SeasonRepository)
    private seasonRepository: SeasonRepository,
    private adminNotificationService: AdminNotificationService,
    private pusherService: PusherService,
    private awsService: AWSService,
    private helperService: HelperService,
    private notificationService: NotificationService,
    private chatService: ChatService,
  ) {}

  async generateXml() {
    const take = 50;
    const usersCount = await this.userRepository
      .createQueryBuilder('a_users')
      .where('a_users.hasProfilePicture = true')
      .getCount();

    const smStream = new SitemapStream({
      hostname: 'https://secretlanguage.network',
    });

    for (let i = 1; i <= Math.ceil(usersCount / take); i++) {
      const users = await this.userRepository
        .createQueryBuilder('a_users')
        .select([
          'a_users.id',
          'a_users.name',
          'a_users.age',
          'a_users.date_name',
          'a_users.sln',
          'day_id.report',
        ])
        .where('a_users.hasProfilePicture = true')
        .skip(take * (Number(i) - 1))
        .take(take)
        .leftJoin('a_users.day_id', 'day_id')
        .getMany();

      users.map((u) => {
        smStream.write({
          url: `/v1/profile/share?id=${u.id}`,
          changefreq: 'daily',
          priority: 1,
          img: u.image,
          links: [
            {
              lang: 'en',
              url: `https://secretlanguage.network/v1/profile/share?id=${u.id}`,
            },
          ],
          news: {
            publication: {
              name: u.name + ', ' + u.age,
              language: 'en',
            },
            genres: 'Blog',
            publication_date: moment(new Date()).format('YYYY-MM-DD'),
            title: u.name + ', ' + u.age,
            keywords:
              'business, merger, acquisition, dating, social media, date, ' +
              u.name +
              ', ' +
              u.date_name +
              ', ' +
              u.sln +
              ', ' +
              u.day_id.report.split(' ').join(', '),
          },
        });
      });
    }
    smStream.end();
    return streamToPromise(smStream).then((xml) => xml);
  }

  async updateUsersAge() {
    const users = await this.userRepository
      .createQueryBuilder('a_users')
      .where('a_users.date_name like :date', {
        date: `${moment(Date.now()).format('MMMM D')}%`,
      })
      .getMany();

    for (let i = 0; i < users.length; i++) {
      const u = users[i];

      u.age = moment().diff(
        moment(u.date_name, 'MMM DD, YYYY').format('YYYY-MM-DD'),
        'years',
      );

      await u.save();
      console.log(`${u.id}. ${u.name} - updated ✅`);
    }

    console.log(`Updated ${users.length} users`);
  }

  async getMe(user: User): Promise<GetMe> {
    let friendRequests: any;
    let birthday_report: any;
    // eslint-disable-next-line prefer-const
    [friendRequests, birthday_report] = await Promise.all([
      await this.friendsRequestsCounts(user),
      await this.showBirthdayReportWithYear(user, {
        birthday: user.date_name,
      }),
    ]);

    return {
      id: user.id,
      username: user.username,
      instagram: user.instagram,
      device_token: user.device_token,
      image: user.image,
      name: user.name,
      age: moment().diff(
        moment(user.date_name, 'MMM DD, YYYY').format('YYYY-MM-DD'),
        'years',
      ),
      friends: Number(friendRequests.friends),
      pending: Number(friendRequests.pending),
      requests: Number(friendRequests.requests),
      signUpDate: `Joined ${moment(user.createdAt).format('MMM DD, YYYY')}`,
      reports: [],
      birthday_report,
    };
  }

  async getProfileImages(user: User) {
    user = await this.userRepository
      .createQueryBuilder('a_users')
      .where('a_users.id = :id', {
        id: user.id,
      })
      .leftJoinAndSelect('a_users.images', 'images')
      .getOne();

    const avatar = user.images.find((images) => images.is_profile_pic);
    const images = user.images.filter(
      (images) => images.is_profile_pic === false,
    );

    return {
      avatar:
        avatar ||
        (images.length > 0
          ? images[0]
          : {
              id: 0,
              image: `${process.env.IMAGE_KIT}default.png?tr=w-600,h-600`,
              is_profile_pic: true,
            }),
      images,
      canAdd: images.length === 3 || images.length > 3 ? false : true,
    };
  }

  async addProfileImage(user: User, image: Buffer) {
    user = await this.userRepository
      .createQueryBuilder('a_users')
      .where('a_users.id = :id', {
        id: user.id,
      })
      .leftJoinAndSelect('a_users.images', 'images')
      .getOne();

    if (user.images.length > 4 || user.images.length === 4) {
      throw new BadRequestException(`You can't upload more than 4 images`);
    }

    if (!image) {
      throw new BadRequestException('Please upload image');
    }

    const img = await this.awsService.uploadFile(image, user.username, 'user/');
    const checkNudity = await this.awsService.checkNudity(img.Key);

    if (checkNudity) {
      this.awsService.deleteFile(img.Key);
      throw new BadRequestException(
        'This image contains nudity or something unacceptable, upload another image',
      );
    }

    try {
      const check = await this.userImagesRepository
        .createQueryBuilder('a_user_images')
        .where(
          'a_user_images.user = :user AND a_user_images.is_profile_pic = :is_profile_pic',
          {
            user: user.id,
            is_profile_pic: true,
          },
        )
        .getOne();

      const is_profile_pic = check ? false : true;
      const newImg = await this.userImagesRepository
        .createQueryBuilder('a_user_images')
        .insert()
        .into(UserImages)
        .values([
          {
            user: () => `${user.id}`,
            image: img.Key,
            is_profile_pic,
          },
        ])
        .returning('*')
        .execute()
        .then((response) => response.raw[0]);

      await this.userRepository
        .createQueryBuilder('a_users')
        .update(User)
        .set({
          hasProfilePicture: true,
        })
        .where('a_users.id = :id', { id: user.id })
        .execute();

      this.adminNotificationsRepository.addImageNotification(
        user.id,
        Number(newImg.id),
      );

      this.adminNotificationService.sendNotificationsToAllAdmins(
        'New Image 🤩',
        `${user.name} has added a new image, please check and reject if necessary`,
      );

      return await this.getProfileImages(user);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async setAvatar(user: User, id: number) {
    if (isNaN(id) || id < 0) {
      throw new BadRequestException('Please select image id');
    }

    const checkImage = await this.userImagesRepository
      .createQueryBuilder('a_user_images')
      .where('a_user_images.id = :id AND a_user_images.user = :user', {
        id,
        user: user.id,
      })
      .getOne();

    if (!checkImage) {
      throw new NotFoundException('There is no image with this id');
    }

    try {
      await this.userImagesRepository
        .createQueryBuilder('a_user_images')
        .update(UserImages)
        .set({
          is_profile_pic: false,
        })
        .where('a_user_images.user = :user', {
          user: user.id,
        })
        .execute();

      await this.userImagesRepository
        .createQueryBuilder('a_user_images')
        .update(UserImages)
        .set({
          is_profile_pic: true,
        })
        .where('a_user_images.id = :id AND a_user_images.user = :user', {
          id,
          user: user.id,
        })
        .execute();

      return this.getProfileImages(user);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteProfileImage(user: User, id: number) {
    if (isNaN(id) || id < 0) {
      throw new BadRequestException('Please select image id');
    }

    const checkImage = await this.userImagesRepository
      .createQueryBuilder('a_user_images')
      .where('a_user_images.id = :id AND a_user_images.user = :user', {
        id,
        user: user.id,
      })
      .getOne();

    if (!checkImage) {
      throw new NotFoundException('There is no image with this id');
    }

    if (checkImage.is_profile_pic) {
      throw new BadRequestException('Please set another avatar then try again');
    }

    if (checkImage.image === 'user/default.png') {
      return this.getProfileImages(user);
    }

    try {
      const path = checkImage.image
        .split(process.env.IMAGE_KIT)[1]
        .split('?')[0];

      if (path !== 'default.png') {
        this.awsService.deleteFile(`user/${path}`);
        console.log('Image deleted');
      }

      await checkImage.remove();

      return await this.getProfileImages(user);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async logout(user: User): Promise<GlobalResponse> {
    user.device_token = '';
    await user.save();

    return {
      status: 'success',
      message: 'You are logged out',
    };
  }

  async deleteUser(user: User): Promise<GlobalResponse> {
    try {
      await this.chatRepository
        .createQueryBuilder('a_chats')
        .delete()
        .where('a_chats.users @> :id', { id: [user.id] })
        .execute();

      await user.remove();
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }

    return {
      status: 'success',
      message: 'The user was successfully deleted',
    };
  }

  async getSettings(user: User): Promise<GetSettingsInterface> {
    const address = user.city ? user.city : user.country_name;

    return {
      name: user.name,
      gender: user.gender,
      country_name: address,
      date_name: user.date_name,
      instagram: user.instagram,
      gender_preference: user.gender_preference,
      interested_in: user.interested_in,
      canEditLocation: user.user_type === 2 ? true : false,
    };
  }

  async updateUser(user: User, body: UpdateUserDto): Promise<GlobalResponse> {
    let updateFields: any = {};
    const {
      name,
      gender,
      date_name,
      instagram,
      gender_preference,
      interested_in,
    } = body;
    if (name !== user.name) {
      updateFields.name = name.trim();
    }

    if ((instagram && instagram !== user.instagram) || instagram === '') {
      updateFields.instagram = instagram;
    }

    if (gender && gender !== user.gender.id) {
      updateFields.gender = gender;
    }

    if (interested_in && interested_in !== user.interested_in.id) {
      updateFields.interested_in = interested_in;
    }

    if (
      (gender_preference && gender_preference !== user.gender_preference) ||
      gender_preference === 0
    ) {
      updateFields.gender_preference = gender_preference;
    }

    if (date_name !== user.date_name) {
      // Check birthday format
      if (!moment(date_name, 'MMM DD, YYYY').isValid()) {
        throw new BadRequestException('Invalid birthday');
      }

      const birthday = moment(date_name, 'MMM DD, YYYY').format('MM/DD/YYYY');

      const y8_dob = Number(
        birthday.split('/')[2] +
          birthday.split('/')[0] +
          birthday.split('/')[1],
      );

      const c_date = await this.dateRepository
        .createQueryBuilder('c_date')
        .where('c_date.y8 = :y8', { y8: y8_dob })
        .getOne();

      const new_date_name: string = c_date.date_name;
      const dob: number = c_date.y8;
      const sln: string = c_date.sln;
      const day_id: any = Number(c_date.day_id);
      const week_id: any = Number(c_date.week_id);
      const month_id: any = Number(c_date.month_id);
      const season_id: any = Number(c_date.season_id);
      const path_id: any = c_date.path_id;
      const way_id: any = c_date.way_id;

      const c_filter = await this.filterRepository
        .createQueryBuilder('c_filter')
        .where('c_filter.id = :id', { id: week_id })
        .getOne();

      const friendship_filter: string = c_filter.friendship;
      const romance_filter: string = c_filter.romance;
      const business_filter: string = c_filter.business;
      const family_filter: string = c_filter.family;

      updateFields = {
        ...updateFields,
        date_name: new_date_name,
        dob,
        day_id,
        week_id,
        month_id,
        season_id,
        way_id,
        path_id,
        sln,
        friendship_filter,
        romance_filter,
        business_filter,
        family_filter,
        age: moment().diff(
          moment(new_date_name, 'MMM DD, YYYY').format('YYYY-MM-DD'),
          'years',
        ),
      };
    }

    if (updateFields) {
      try {
        await this.userRepository
          .createQueryBuilder('a_users')
          .update(User)
          .set(updateFields)
          .where('a_users.id = :id', { id: user.id })
          .execute();

        await this.userUnlockedBirthdaysRepository
          .createQueryBuilder('a_user_unlocked_birthdays')
          .delete()
          .from(UserUnlockedBirthdays)
          .where(
            'a_user_unlocked_birthdays.date_name = :date_name AND a_user_unlocked_birthdays.user = :user',
            { date_name: user.date_name, user: user.id },
          )
          .execute();

        return {
          status: 'success',
          message: 'Updated! 😊',
        };
      } catch (error) {
        throw new InternalServerErrorException(error.message);
      }
    } else {
      return {
        status: 'success',
        message: 'Updated! 😊',
      };
    }
  }

  async updateUserLocation(user: User, body: UpdateLocationDto) {
    if (user.user_type !== 2) {
      throw new ConflictException('Only subscribed users can edit location');
    }

    const { id } = body;
    if (isNaN(id) || id < 1)
      throw new BadRequestException('Please provide city id');

    const city = await this.citiesRepository.findOne(id);

    if (!city) throw new NotFoundException('There is no city with this id');

    const { lat, lng, name } = city;

    if (
      Number(lat).toFixed(2) === (0).toFixed(2) &&
      Number(lng).toFixed(2) === (0).toFixed(2)
    ) {
      return {
        status: 'conflict',
        message: 'Lng and lat is equal to 0',
      };
    }

    try {
      user.location = { type: 'Point', coordinates: [lng, lat] };

      user.city = name;
      user.locationEdittedByUser = true;
      await user.save();
      return {
        status: 'success',
        message: 'User location was successfully updated',
      };
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async getUserProfile(
    me: User,
    body: SendFriendRequestDto,
  ): Promise<GetUserProfileInterface> {
    const { week_id, date_name } = me;
    const { id } = body;
    if (me.id === id) {
      throw new BadRequestException('Please use /user/me route');
    }
    const my_birthday_name: string = week_id.name_short;

    const user = await this.userRepository
      .createQueryBuilder('a_users')
      .select([
        'a_users.id',
        'a_users.username',
        'a_users.name',
        'a_users.instagram',
        'a_users.sln',
        'a_users.location',
        'a_users.city',
        'a_users.country_name',
        'a_users.date_name',
        'a_users.gender_preference',
        'a_users.createdAt',
        'week_id.id',
        'week_id.name_short',
        'images.id',
        'images.image',
        'images.is_profile_pic',
        'gender.gender_name',
        'interested_in.name',
      ])
      .where('a_users.id = :id', { id })
      .leftJoin('a_users.gender', 'gender')
      .leftJoin('a_users.interested_in', 'interested_in')
      .leftJoin('a_users.week_id', 'week_id')
      .leftJoin('a_users.images', 'images')
      .getOne();

    if (!user) {
      throw new NotFoundException('There is no user with this id');
    }

    let week1: number, week2: number;
    const user_birthday_name: string = user.week_id.name_short;
    const distance =
      me.location && user.location
        ? this.helperService.getDistance(me, user)
        : user.city
        ? user.city
        : user.country_name;

    if (week_id.id < user.week_id.id) {
      week1 = week_id.id;
      week2 = user.week_id.id;
    } else {
      week1 = user.week_id.id;
      week2 = week_id.id;
    }

    const relQueryString =
      'c_relationship.week1 = :week1 AND c_relationship.week2 = :week2';
    const relQueryObject: any = { week1, week2 };

    let rel: any,
      c_date: any,
      requestStatus: any,
      friendStatus: number,
      checkChat: any,
      chatId: number = null;
    // eslint-disable-next-line prefer-const
    [rel, c_date, requestStatus, checkChat] = await Promise.all([
      await this.relationshipRepository
        .createQueryBuilder('c_relationship')
        .select([
          'c_relationship.ideal',
          'c_relationship.report',
          'c_relationship.advice',
          'c_relationship.icon',
        ])
        .where(relQueryString, relQueryObject)
        .getOne(),
      await this.dateRepository
        .createQueryBuilder('c_date')
        .select('c_date.y8')
        .where('c_date.sln = :sln', { sln: user.sln })
        .leftJoinAndSelect('c_date.day_id', 'day_id')
        .getMany(),
      await this.userFriendRequestsRepository
        .createQueryBuilder('a_user_friend_requests')
        .where(
          'a_user_friend_requests.send_by = :send_by AND a_user_friend_requests.send_to = :send_to OR a_user_friend_requests.send_by = :send_to AND a_user_friend_requests.send_to = :send_by',
          { send_by: user.id, send_to: me.id },
        )
        .getOne(),
      await this.chatRepository
        .createQueryBuilder('a_chats')
        .where('a_chats.users @> :users', { users: [user.id, me.id] })
        .getOne(),
    ]);

    if (rel && c_date) {
      if (!requestStatus) {
        // No friend
        friendStatus = 1;
      } else {
        if (Number(requestStatus.send_by) === user.id) {
          if (requestStatus.status === 'pending') {
            // Accept or reject
            friendStatus = 4;
          } else if (requestStatus.status === 'accepted') {
            // Friend
            friendStatus = 2;

            if (checkChat) {
              chatId = checkChat.id;
            } else {
              const newChat = await this.chatRepository
                .createQueryBuilder('a_chats')
                .insert()
                .into(Chat)
                .values([
                  {
                    chatName: `${me.name} + ${user.name}`,
                    users: [user.id, me.id],
                  },
                ])
                .returning('*')
                .execute()
                .then((response) => response.raw[0]);

              chatId = newChat.id;
            }
          } else if (requestStatus.status === 'rejected') {
            // No friend
            friendStatus = 1;
          }
        } else if (Number(requestStatus.send_to) === user.id) {
          if (requestStatus.status === 'pending') {
            // I sent friend request
            friendStatus = 3;
          } else if (requestStatus.status === 'accepted') {
            // Friend
            friendStatus = 2;

            if (checkChat) {
              chatId = checkChat.id;
            } else {
              const newChat = await this.chatRepository
                .createQueryBuilder('a_chats')
                .insert()
                .into(Chat)
                .values([
                  {
                    chatName: `${user.name} + ${me.name}`,
                    users: [user.id, me.id],
                  },
                ])
                .returning('*')
                .execute()
                .then((response) => response.raw[0]);

              chatId = newChat.id;
            }
          } else if (requestStatus.status === 'rejected') {
            friendStatus = 1;
          }
        } else {
          friendStatus = 1;
        }
      }

      return {
        id: user.id,
        username: user.username,
        name: user.name,
        instagram: user.instagram,
        age: moment().diff(
          moment(user.date_name, 'MMM DD, YYYY').format('YYYY-MM-DD'),
          'years',
        ),
        signUpDate: `Joined ${moment(user.createdAt).format('MMM DD, YYYY')}`,
        user_birthday: user.date_name.split(',')[0],
        user_birthday_name,
        sln: user.sln,
        sln_description:
          'This name describes the life energy of this day. People born during this day will retain and radiate its energy and will exhibit most of the personality traits we discovered for their day, week, month, season, and year as shown b...',
        image: user.image,
        images:
          user.images.length !== 0
            ? user.images.sort(function (x, y) {
                return x.is_profile_pic === y.is_profile_pic ? 0 : x ? -1 : 1;
              })
            : [
                {
                  id: 0,
                  image: `${process.env.IMAGE_KIT}default.png?tr=w-600,h-600`,
                  is_profile_pic: true,
                },
              ],
        rel_image: rel.image,
        my_birthday: date_name,
        my_birthday_name,
        looking_for: `${user.gender.gender_name} looking for ${
          user.gender_preference === 0
            ? 'Everyone'
            : user.gender_preference === 1
            ? 'Male'
            : 'Female'
        } in ${user.interested_in.name}`,
        ideal_for: rel.ideal,
        report: this.helperService.clearText(rel.report),
        advice: this.helperService.clearText(rel.advice),
        famous_years: c_date
          .map((f: any) => {
            if (Number(String(f.y8).substring(0, 4)) < moment().year())
              return String(f.y8).substring(0, 4);
            else return '';
          })
          .filter((f: any) => f !== '')
          .sort()
          .join(', '),
        distance,
        friendStatus,
        chatId,
      };
    } else {
      throw new BadRequestException(
        'There is no relation with this credentials',
      );
    }
  }

  async getSharedUser(id: number) {
    if (isNaN(id) || id < 0) {
      throw new BadRequestException('Please select user id');
    }

    const user = await this.userRepository
      .createQueryBuilder('a_users')
      .select([
        'a_users.id',
        'a_users.name',
        'a_users.instagram',
        'a_users.date_name',
        'a_users.country_name',
        'a_users.city',
        'a_users.sln',
        'a_users.gender_preference',
        'week_id.name_short',
        'day_id.report',
        'day_id.numbers',
        'day_id.archetype',
        'day_id.health',
        'day_id.advice',
        'gender.gender_name',
        'interested_in.name',
      ])
      .where('a_users.id = :id', { id })
      .leftJoin('a_users.gender', 'gender')
      .leftJoin('a_users.interested_in', 'interested_in')
      .leftJoin('a_users.day_id', 'day_id')
      .leftJoin('a_users.week_id', 'week_id')
      .leftJoinAndSelect('a_users.images', 'images')
      .getOne();

    if (!user) {
      throw new NotFoundException('There is no user with this id');
    }

    const c_date = await this.dateRepository
      .createQueryBuilder('c_date')
      .where('c_date.sln = :sln', { sln: user.sln })
      .getMany();

    if (c_date) {
      const retUser = {
        id: user.id,
        name: user.name,
        instagram: user.instagram,
        age: moment().diff(
          moment(user.date_name, 'MMM DD, YYYY').format('YYYY-MM-DD'),
          'years',
        ),
        signUpDate: `Joined ${moment(user.createdAt).format('MMM DD, YYYY')}`,
        user_birthday: user.date_name.split(',')[0],
        user_birthday_name: user.week_id.name_short,
        sln: user.sln,
        sln_description:
          'This name describes the life energy of this day. People born during this day will retain and radiate its energy and will exhibit most of the personality traits we discovered for their day, week, month, season, and year as shown b...',
        image: user.image,
        images:
          user.images.length !== 0
            ? user.images.sort(function (x, y) {
                return x.is_profile_pic === y.is_profile_pic ? 0 : x ? -1 : 1;
              })
            : [
                {
                  id: 0,
                  image: `${process.env.IMAGE_KIT}default.png?tr=w-600,h-600`,
                  is_profile_pic: true,
                },
              ],
        report: this.helperService.clearText(user.day_id.report),
        numbers: this.helperService.clearText(user.day_id.numbers),
        archetype: this.helperService.clearText(user.day_id.archetype),
        health: this.helperService.clearText(user.day_id.health),
        advice: this.helperService.clearText(user.day_id.advice),
        famous_years: c_date
          .map((f: any) => {
            if (Number(String(f.y8).substring(0, 4)) < moment().year())
              return String(f.y8).substring(0, 4);
            else return '';
          })
          .filter((f: any) => f !== '')
          .sort()
          .join(', '),
        distance: user.city
          ? `${user.city}, ${
              user.country_name === 'United States of America'
                ? 'US'
                : user.country_name
            }`
          : user.country_name,
        looking_for: `${user.gender.gender_name} looking for ${
          user.gender_preference === 0
            ? 'Everyone'
            : user.gender_preference === 1
            ? 'Male'
            : 'Female'
        } in ${user.interested_in.name}`,
      };

      return retUser;
    } else {
      throw new BadRequestException('There is no date with this credentials');
    }
  }

  async addDeviceToken(user: User, body: AddDeviceTokenDto) {
    const { device_token } = body;

    if (!device_token) {
      return {
        status: 'success',
        message: 'Device token was not found',
      };
    }

    user.device_token = device_token;
    user.save();

    return {
      status: 'success',
      message: 'Device token was successfully added',
    };
  }

  async showBirthdayReportWithYear(user: User, body: ShowBirthdayReportDto) {
    const id: any = user.id;
    const { birthday } = body;
    let week_1: any, week_2: any, famous: any;
    if (birthday.split(',')[0] !== 'February 29') {
      // Check birthday format
      if (!moment(birthday, 'll').isValid()) {
        throw new BadRequestException('Invalid birthday');
      }
    }

    const c_date = await this.dateRepository
      .createQueryBuilder('c_date')
      .where('c_date.date_name = :birthday', {
        birthday: `${birthday}`,
      })
      .leftJoinAndSelect('c_date.day_id', 'day_id')
      .innerJoinAndSelect('day_id.famous', 'day_famous')
      .leftJoinAndSelect('c_date.week_id', 'week_id')
      .innerJoinAndSelect('week_id.famous', 'week_famous')
      .leftJoinAndSelect('c_date.month_id', 'month_id')
      .leftJoinAndSelect('c_date.season_id', 'season_id')
      .getOne();

    if (!c_date) {
      throw new NotFoundException(
        'There is no birthday report. Please change date.',
      );
    }

    let way_id: any, path_id: any;
    if (c_date.way_id !== 0 || c_date.path_id !== 0) {
      [way_id, path_id] = await Promise.all([
        await this.wayRepository
          .createQueryBuilder('c_way')
          .where('c_way.id = :id', { id: c_date.way_id })
          .leftJoinAndSelect('c_way.famous', 'famous')
          .getOne(),
        await this.pathRepository
          .createQueryBuilder('c_path')
          .where('c_path.id = :id', { id: c_date.path_id })
          .getOne(),
      ]);
    }

    c_date.day_id.famous = await async.map(
      c_date.day_id.famous,
      async (f: any) => {
        return {
          id: f.id,
          name: f.name,
          sln: f.sl_name,
          age: `born ${moment().diff(
            moment(
              `${String(f.birthdate).charAt(0)}${String(f.birthdate).charAt(
                1,
              )}${String(f.birthdate).charAt(2)}${String(f.birthdate).charAt(
                3,
              )}/${String(f.birthdate).charAt(4)}${String(f.birthdate).charAt(
                5,
              )}/${String(f.birthdate).charAt(6)}${String(f.birthdate).charAt(
                7,
              )}`,
              'YYYY/MM/DD',
            ).format('YYYY-MM-DD'),
            'years',
          )} years ago`,
          image: f.image,
        };
      },
    );

    c_date.week_id.famous = await async.map(
      c_date.week_id.famous,
      async (f: any) => {
        return {
          id: f.id,
          name: f.name,
          sln: f.sl_name,
          age: `born ${moment().diff(
            moment(
              `${String(f.birthdate).charAt(0)}${String(f.birthdate).charAt(
                1,
              )}${String(f.birthdate).charAt(2)}${String(f.birthdate).charAt(
                3,
              )}/${String(f.birthdate).charAt(4)}${String(f.birthdate).charAt(
                5,
              )}/${String(f.birthdate).charAt(6)}${String(f.birthdate).charAt(
                7,
              )}`,
              'YYYY/MM/DD',
            ).format('YYYY-MM-DD'),
            'years',
          )} years ago`,
          image: f.image,
        };
      },
    );

    const week1 = user.week_id.id;
    const week2 = c_date.week_id.id;

    if (week1 < week2) {
      week_1 = week1;
      week_2 = week2;
    } else {
      week_1 = week2;
      week_2 = week1;
    }

    const [rel, f_dates] = await Promise.all([
      await this.relationshipRepository
        .createQueryBuilder('c_relationship')
        .where(
          'c_relationship.week1 = :week1 AND c_relationship.week2 = :week2',
          { week1: week_1, week2: week_2 },
        )
        .getOne(),
      await this.dateRepository
        .createQueryBuilder('c_date')
        .select('c_date.y8')
        .where('c_date.sln = :sln', { sln: c_date.sln })
        .leftJoinAndSelect('c_date.day_id', 'day_id')
        .getMany(),
    ]);

    if (!rel) {
      throw new NotFoundException(
        'There is no relationship report. Please change date.',
      );
    }

    if (way_id) {
      way_id.famous = await async.map(way_id.famous, async (f: any) => {
        return {
          id: f.id,
          name: f.name,
          sln: f.sl_name,
          age: `born ${moment().diff(
            moment(
              `${String(f.birthdate).charAt(0)}${String(f.birthdate).charAt(
                1,
              )}${String(f.birthdate).charAt(2)}${String(f.birthdate).charAt(
                3,
              )}/${String(f.birthdate).charAt(4)}${String(f.birthdate).charAt(
                5,
              )}/${String(f.birthdate).charAt(6)}${String(f.birthdate).charAt(
                7,
              )}`,
              'YYYY/MM/DD',
            ).format('YYYY-MM-DD'),
            'years',
          )} years ago`,
          image: f.image,
        };
      });
    }

    if (f_dates) {
      famous = await async.map(f_dates, async (f: any) => {
        if (Number(String(f.y8).substring(0, 4)) < moment().year())
          return String(f.y8).substring(0, 4);
        else return '';
      });
    }

    let retDate: any = {
      id: c_date.id,
      date_name: birthday,
      sln: c_date.sln,
      sln_description:
        'This name describes the life energy of this day. People born during this day will retain and radiate its energy and will exhibit most of the personality traits we discovered for their day, week, month, season, and year as shown b...',
      famous_years: famous
        ? famous
            .filter((f: any) => f !== '')
            .sort()
            .join(', ')
        : '',
      day_report: {
        ...c_date.day_id,
        meditation: this.helperService.clearText(c_date.day_id.meditation),
        report: this.helperService.clearText(c_date.day_id.report),
        numbers: this.helperService.clearText(c_date.day_id.numbers),
        archetype: this.helperService.clearText(c_date.day_id.archetype),
        health: this.helperService.clearText(c_date.day_id.health),
        advice: this.helperService.clearText(c_date.day_id.advice),
      },
      week_report: {
        ...c_date.week_id,
        report: this.helperService.clearText(c_date.week_id.report),
        advice: this.helperService.clearText(c_date.week_id.advice),
      },
      month_report: {
        ...c_date.month_id,
        report: this.helperService.clearText(c_date.month_id.report),
        personality: this.helperService.clearText(c_date.month_id.personality),
      },
      season_report: {
        ...c_date.season_id,
        activity: this.helperService.clearText(c_date.season_id.activity),
        report: this.helperService.clearText(c_date.season_id.report),
      },
      relationship_report: {
        id: rel.id,
        birthday_1: user.week_id.name_long,
        birthday_1_name: user.date_name,
        birthday_2: c_date.week_id.name_long,
        birthday_2_name: birthday,
        image: rel.image,
        name: rel.title,
        s1: rel.s1,
        s2: rel.s2,
        s3: rel.s3,
        w1: rel.w1,
        w2: rel.w2,
        w3: rel.w3,
        ideal_for: rel.ideal,
        problematic_for: rel.problematic,
        report: this.helperService.clearText(rel.report),
        advice: this.helperService.clearText(rel.advice),
        shareId: 0,
      },
    };

    if (way_id && path_id) {
      retDate = {
        ...retDate,
        way_report: {
          id: way_id.id,
          name: way_id.name,
          image: way_id.image,
          week_from: way_id.week_from,
          week_to: way_id.week_to,
          s1: way_id.s1,
          s2: way_id.s2,
          s3: way_id.s3,
          w1: way_id.w1,
          w2: way_id.w2,
          w3: way_id.w3,
          report: this.helperService.clearText(way_id.report),
          suggestion: this.helperService.clearText(way_id.suggestion),
          lesson: this.helperService.clearText(way_id.core_lesson),
          goal: this.helperService.clearText(way_id.goal),
          release: this.helperService.clearText(way_id.must_release),
          reward: this.helperService.clearText(way_id.reward),
          balance: this.helperService.clearText(way_id.balance_point),
          famous: way_id.famous,
        },
        path_report: {
          id: path_id.id,
          prefix: way_id.prefix,
          way_name: way_id.name,
          name_long: c_date.week_id.name_long,
          name_medium: c_date.week_id.name_medium,
          image: path_id.image,
          challenge: this.helperService.clearText(path_id.challenge),
          fulfillment: this.helperService.clearText(path_id.fulfillment),
          report: this.helperService.clearText(path_id.report),
        },
      };
    } else {
      retDate = {
        ...retDate,
        way_report: null,
        path_report: null,
      };
    }

    if (user.date_name === birthday) {
      const report = await this.userUnlockedBirthdaysRepository
        .createQueryBuilder('a_user_unlocked_birthdays')
        .where(
          'a_user_unlocked_birthdays.user = :user AND a_user_unlocked_birthdays.date_name = :date_name',
          { user: id, date_name: birthday },
        )
        .getOne();

      if (report) {
        return {
          ...retDate,
          shareId: report.id,
        };
      } else {
        try {
          const newReport = await this.userUnlockedBirthdaysRepository
            .createQueryBuilder('a_user_unlocked_birthdays')
            .insert()
            .into(UserUnlockedBirthdays)
            .values([
              {
                user: id,
                date_name: birthday,
                type: UnlockedReportEnum.PERSONAL_REPORT,
              },
            ])
            .returning('*')
            .execute()
            .then((response) => response.raw[0]);

          return {
            ...retDate,
            shareId: newReport.id,
          };
        } catch (err) {
          throw new BadRequestException(`${err.message}. Please try again`);
        }
      }
    }

    // Check if unlocked report
    const checkUnlockedreport = await this.userUnlockedBirthdaysRepository
      .createQueryBuilder('a_user_unlocked_birthdays')
      .where(
        'a_user_unlocked_birthdays.user = :user AND a_user_unlocked_birthdays.date_name = :date_name',
        { user: id, date_name: birthday },
      )
      .getOne();

    if (checkUnlockedreport) {
      return {
        ...retDate,
        shareId: checkUnlockedreport.id,
      };
    } else {
      // Check if user vip_user or not
      if (user.user_type !== 2) {
        throw new UnprocessableEntityException(
          `You don't have permission to perform this action. Please subscribe one of this plans`,
        );
      } else {
        try {
          const newReport = await this.userUnlockedBirthdaysRepository
            .createQueryBuilder('a_user_unlocked_birthdays')
            .insert()
            .into(UserUnlockedBirthdays)
            .values([
              {
                user: id,
                date_name: birthday,
                type: UnlockedReportEnum.VIP_USER,
              },
            ])
            .returning('*')
            .execute()
            .then((response) => response.raw[0]);

          return {
            ...retDate,
            shareId: newReport.id,
          };
        } catch (err) {
          throw new BadRequestException(`${err.message}. Please try again`);
        }
      }
    }
  }

  async showBirthdayReport(
    user: User,
    body: ShowBirthdayReportDto,
    year?: number,
  ) {
    const id: any = user.id;
    const { birthday } = body;
    let week_1: any, week_2: any, famous: any;
    if (birthday !== 'February 29') {
      // Check birthday format
      if (!moment(birthday, 'll').isValid()) {
        throw new BadRequestException('Invalid birthday');
      }
    }

    const c_date = await this.dateRepository
      .createQueryBuilder('c_date')
      .where('c_date.date_name = :birthday', {
        birthday: `${birthday}, ${
          year ? year : birthday === 'February 29' ? 2020 : moment().year()
        }`,
      })
      .leftJoinAndSelect('c_date.day_id', 'day_id')
      .innerJoinAndSelect('day_id.famous', 'day_famous')
      .leftJoinAndSelect('c_date.week_id', 'week_id')
      .innerJoinAndSelect('week_id.famous', 'week_famous')
      .leftJoinAndSelect('c_date.month_id', 'month_id')
      .leftJoinAndSelect('c_date.season_id', 'season_id')
      .getOne();

    if (!c_date) {
      throw new NotFoundException(
        'There is no birthday report. Please change date.',
      );
    }

    const [way_id, path_id] = await Promise.all([
      await this.wayRepository
        .createQueryBuilder('c_way')
        .where('c_way.id = :id', { id: c_date.way_id })
        .leftJoinAndSelect('c_way.famous', 'famous')
        .getOne(),
      await this.pathRepository
        .createQueryBuilder('c_path')
        .where('c_path.id = :id', { id: c_date.path_id })
        .getOne(),
    ]);

    if (!way_id) {
      throw new NotFoundException(
        'There is no way report. Please try again or change date',
      );
    }

    if (!path_id) {
      throw new NotFoundException(
        'There is no path report. Please try again or change date',
      );
    }

    c_date.day_id.famous = await async.map(
      c_date.day_id.famous,
      async (f: any) => {
        return {
          id: f.id,
          name: f.name,
          sln: f.sl_name,
          age: `born ${moment().diff(
            moment(
              `${String(f.birthdate).charAt(0)}${String(f.birthdate).charAt(
                1,
              )}${String(f.birthdate).charAt(2)}${String(f.birthdate).charAt(
                3,
              )}/${String(f.birthdate).charAt(4)}${String(f.birthdate).charAt(
                5,
              )}/${String(f.birthdate).charAt(6)}${String(f.birthdate).charAt(
                7,
              )}`,
              'YYYY/MM/DD',
            ).format('YYYY-MM-DD'),
            'years',
          )} years ago`,
          image: f.image,
        };
      },
    );

    c_date.week_id.famous = await async.map(
      c_date.week_id.famous,
      async (f: any) => {
        return {
          id: f.id,
          name: f.name,
          sln: f.sl_name,
          age: `born ${moment().diff(
            moment(
              `${String(f.birthdate).charAt(0)}${String(f.birthdate).charAt(
                1,
              )}${String(f.birthdate).charAt(2)}${String(f.birthdate).charAt(
                3,
              )}/${String(f.birthdate).charAt(4)}${String(f.birthdate).charAt(
                5,
              )}/${String(f.birthdate).charAt(6)}${String(f.birthdate).charAt(
                7,
              )}`,
              'YYYY/MM/DD',
            ).format('YYYY-MM-DD'),
            'years',
          )} years ago`,
          image: f.image,
        };
      },
    );

    const week1 = user.week_id.id;
    const week2 = c_date.week_id.id;

    if (week1 < week2) {
      week_1 = week1;
      week_2 = week2;
    } else {
      week_1 = week2;
      week_2 = week1;
    }

    const [rel, f_dates] = await Promise.all([
      await this.relationshipRepository
        .createQueryBuilder('c_relationship')
        .where(
          'c_relationship.week1 = :week1 AND c_relationship.week2 = :week2',
          { week1: week_1, week2: week_2 },
        )
        .getOne(),
      await this.dateRepository
        .createQueryBuilder('c_date')
        .select('c_date.y8')
        .where('c_date.sln = :sln', { sln: c_date.sln })
        .leftJoinAndSelect('c_date.day_id', 'day_id')
        .getMany(),
    ]);

    if (!rel) {
      throw new NotFoundException(
        'There is no relationship report. Please change date.',
      );
    }

    way_id.famous = await async.map(way_id.famous, async (f: any) => {
      return {
        id: f.id,
        name: f.name,
        sln: f.sl_name,
        age: `born ${moment().diff(
          moment(
            `${String(f.birthdate).charAt(0)}${String(f.birthdate).charAt(
              1,
            )}${String(f.birthdate).charAt(2)}${String(f.birthdate).charAt(
              3,
            )}/${String(f.birthdate).charAt(4)}${String(f.birthdate).charAt(
              5,
            )}/${String(f.birthdate).charAt(6)}${String(f.birthdate).charAt(
              7,
            )}`,
            'YYYY/MM/DD',
          ).format('YYYY-MM-DD'),
          'years',
        )} years ago`,
        image: f.image,
      };
    });

    if (f_dates) {
      famous = await async.map(f_dates, async (f: any) => {
        if (Number(String(f.y8).substring(0, 4)) < moment().year())
          return String(f.y8).substring(0, 4);
        else return '';
      });
    }

    const retDate = {
      id: c_date.id,
      date_name: birthday,
      sln: c_date.sln,
      sln_description:
        'This name describes the life energy of this day. People born during this day will retain and radiate its energy and will exhibit most of the personality traits we discovered for their day, week, month, season, and year as shown b...',
      famous_years: famous
        ? famous
            .filter((f: any) => f !== '')
            .sort()
            .join(', ')
        : '',
      day_report: {
        ...c_date.day_id,
        meditation: this.helperService.clearText(c_date.day_id.meditation),
        report: this.helperService.clearText(c_date.day_id.report),
        numbers: this.helperService.clearText(c_date.day_id.numbers),
        archetype: this.helperService.clearText(c_date.day_id.archetype),
        health: this.helperService.clearText(c_date.day_id.health),
        advice: this.helperService.clearText(c_date.day_id.advice),
      },
      week_report: {
        ...c_date.week_id,
        report: this.helperService.clearText(c_date.week_id.report),
        advice: this.helperService.clearText(c_date.week_id.advice),
      },
      month_report: {
        ...c_date.month_id,
        report: this.helperService.clearText(c_date.month_id.report),
        personality: this.helperService.clearText(c_date.month_id.personality),
      },
      season_report: {
        ...c_date.season_id,
        activity: this.helperService.clearText(c_date.season_id.activity),
        report: this.helperService.clearText(c_date.season_id.report),
      },
      way_report: {
        id: way_id.id,
        name: way_id.name,
        image: way_id.image,
        week_from: way_id.week_from,
        week_to: way_id.week_to,
        s1: way_id.s1,
        s2: way_id.s2,
        s3: way_id.s3,
        w1: way_id.w1,
        w2: way_id.w2,
        w3: way_id.w3,
        report: this.helperService.clearText(way_id.report),
        suggestion: this.helperService.clearText(way_id.suggestion),
        lesson: this.helperService.clearText(way_id.core_lesson),
        goal: this.helperService.clearText(way_id.goal),
        release: this.helperService.clearText(way_id.must_release),
        reward: this.helperService.clearText(way_id.reward),
        balance: this.helperService.clearText(way_id.balance_point),
        famous: way_id.famous,
      },
      path_report: {
        id: path_id.id,
        prefix: way_id.prefix,
        way_name: way_id.name,
        name_long: c_date.week_id.name_long,
        name_medium: c_date.week_id.name_medium,
        image: path_id.image,
        challenge: this.helperService.clearText(path_id.challenge),
        fulfillment: this.helperService.clearText(path_id.fulfillment),
        report: this.helperService.clearText(path_id.report),
      },
      relationship_report: {
        id: rel.id,
        birthday_1: user.week_id.name_long,
        birthday_1_name: user.date_name,
        birthday_2: c_date.week_id.name_long,
        birthday_2_name: birthday,
        image: rel.image,
        name: rel.title,
        s1: rel.s1,
        s2: rel.s2,
        s3: rel.s3,
        w1: rel.w1,
        w2: rel.w2,
        w3: rel.w3,
        ideal_for: rel.ideal,
        problematic_for: rel.problematic,
        report: this.helperService.clearText(rel.report),
        advice: this.helperService.clearText(rel.advice),
        shareId: 0,
      },
    };

    if (user.date_name.split(',')[0] === birthday) {
      const report = await this.userUnlockedBirthdaysRepository
        .createQueryBuilder('a_user_unlocked_birthdays')
        .where(
          'a_user_unlocked_birthdays.user = :user AND a_user_unlocked_birthdays.date_name = :date_name',
          { user: id, date_name: birthday },
        )
        .getOne();

      if (report) {
        return {
          ...retDate,
          shareId: report.id,
        };
      } else {
        try {
          const newReport = await this.userUnlockedBirthdaysRepository
            .createQueryBuilder('a_user_unlocked_birthdays')
            .insert()
            .into(UserUnlockedBirthdays)
            .values([
              {
                user: id,
                date_name: birthday,
                type: UnlockedReportEnum.PERSONAL_REPORT,
              },
            ])
            .returning('*')
            .execute()
            .then((response) => response.raw[0]);

          return {
            ...retDate,
            shareId: newReport.id,
          };
        } catch (err) {
          throw new BadRequestException(`${err.message}. Please try again`);
        }
      }
    }

    // Check if unlocked report
    const checkUnlockedreport = await this.userUnlockedBirthdaysRepository
      .createQueryBuilder('a_user_unlocked_birthdays')
      .where(
        'a_user_unlocked_birthdays.user = :user AND a_user_unlocked_birthdays.date_name = :date_name',
        { user: id, date_name: birthday },
      )
      .getOne();

    if (checkUnlockedreport) {
      return {
        ...retDate,
        shareId: checkUnlockedreport.id,
      };
    } else {
      // Check if user vip_user or not
      if (user.user_type !== 2) {
        throw new UnprocessableEntityException(
          `You don't have permission to perform this action. Please subscribe one of this plans`,
        );
      } else {
        try {
          const newReport = await this.userUnlockedBirthdaysRepository
            .createQueryBuilder('a_user_unlocked_birthdays')
            .insert()
            .into(UserUnlockedBirthdays)
            .values([
              {
                user: id,
                date_name: birthday,
                type: UnlockedReportEnum.VIP_USER,
              },
            ])
            .returning('*')
            .execute()
            .then((response) => response.raw[0]);

          return {
            ...retDate,
            shareId: newReport.id,
          };
        } catch (err) {
          throw new BadRequestException(`${err.message}. Please try again`);
        }
      }
    }
  }

  async showRelationshipReport(user: User, body: ShowRelationshipReportDto) {
    const id: any = user.id;
    const { birthday_1, birthday_2 } = body;
    let week_1: any, week_2: any;
    if (birthday_1.split(',')[0] !== 'February 29') {
      // Check birthday format
      if (!moment(birthday_1, 'll').isValid()) {
        throw new BadRequestException('Invalid birthday 1');
      }
    }

    if (birthday_2.split(',')[0] !== 'February 29') {
      // Check birthday format
      if (!moment(birthday_2, 'll').isValid()) {
        throw new BadRequestException('Invalid birthday 2');
      }
    }

    const [c_date_1, c_date_2] = await Promise.all([
      await this.dateRepository
        .createQueryBuilder('c_date')
        .where('c_date.date_name = :birthday', { birthday: birthday_1 })
        .leftJoinAndSelect('c_date.day_id', 'day_id')
        .leftJoinAndSelect('c_date.week_id', 'week_id')
        .getOne(),
      await this.dateRepository
        .createQueryBuilder('c_date')
        .where('c_date.date_name = :birthday', { birthday: birthday_2 })
        .leftJoinAndSelect('c_date.day_id', 'day_id')
        .leftJoinAndSelect('c_date.week_id', 'week_id')
        .getOne(),
    ]);

    if (!c_date_1)
      throw new BadRequestException(
        'Invalid birthday 1. Please user another date',
      );

    if (!c_date_2)
      throw new BadRequestException(
        'Invalid birthday 2. Please user another date',
      );

    const week1 = c_date_1.week_id.id;
    const week2 = c_date_2.week_id.id;

    if (week1 < week2) {
      week_1 = week1;
      week_2 = week2;
    } else {
      week_1 = week2;
      week_2 = week1;
    }

    const [rel, checkUnlockedRelationship] = await Promise.all([
      await this.relationshipRepository
        .createQueryBuilder('c_relationship')
        .where(
          'c_relationship.week1 = :week1 AND c_relationship.week2 = :week2',
          { week1: week_1, week2: week_2 },
        )
        .getOne(),
      await this.userUnlockedRelationshipsRepository
        .createQueryBuilder('a_user_unlocked_relationships')
        .where(
          'a_user_unlocked_relationships.date_name_1 = :date_name_1 AND a_user_unlocked_relationships.date_name_2 = :date_name_2 AND a_user_unlocked_relationships.user = :user OR a_user_unlocked_relationships.date_name_1 = :date_name_2 AND a_user_unlocked_relationships.date_name_2 = :date_name_1 AND a_user_unlocked_relationships.user = :user',
          { user: id, date_name_1: birthday_1, date_name_2: birthday_2 },
        )
        .getOne(),
    ]);

    if (!rel) {
      throw new NotFoundException(
        'There is no relationship report. Please change date.',
      );
    }

    const retRelationship = {
      id: rel.id,
      birthday_1: c_date_1.week_id.name_long,
      birthday_1_name: c_date_1.date_name,
      birthday_2: c_date_2.week_id.name_long,
      birthday_2_name: c_date_2.date_name,
      image: rel.image,
      name: rel.title,
      s1: rel.s1,
      s2: rel.s2,
      s3: rel.s3,
      w1: rel.w1,
      w2: rel.w2,
      w3: rel.w3,
      ideal_for: rel.ideal,
      problematic_for: rel.problematic,
      report: this.helperService.clearText(rel.report),
      advice: this.helperService.clearText(rel.advice),
    };

    if (checkUnlockedRelationship) {
      return {
        ...retRelationship,
        shareId: checkUnlockedRelationship.id,
      };
    } else {
      // Check if user vip_user or not
      if (user.user_type !== 2) {
        throw new UnprocessableEntityException(
          `You don't have permission to perform this action. Please subscribe one of this plans`,
        );
      } else {
        try {
          const newReport = await this.userUnlockedRelationshipsRepository
            .createQueryBuilder('a_user_unlocked_relationships')
            .insert()
            .into(UserUnlockedRelationships)
            .values([
              {
                user: id,
                date_name_1: c_date_1.date_name,
                date_name_2: c_date_2.date_name,
                type: UnlockedReportEnum.BOUGHT_REPORT,
              },
            ])
            .returning('*')
            .execute()
            .then((response) => response.raw[0]);

          return {
            ...retRelationship,
            shareId: newReport.id,
          };
        } catch (err) {
          throw new BadRequestException(`${err.message}. Please try again`);
        }
      }
    }
  }

  async getBirthdayReport(id: number) {
    if (!id || id < 0 || id === 0) {
      throw new BadRequestException('Please provide id');
    }

    const report = await this.userUnlockedBirthdaysRepository
      .createQueryBuilder('a_user_unlocked_birthdays')
      .where('a_user_unlocked_birthdays.id = :id', { id })
      .leftJoinAndSelect('a_user_unlocked_birthdays.user', 'user')
      .innerJoinAndSelect('user.week_id', 'week_id')
      .getOne();

    if (!report) {
      throw new NotFoundException('There is no birthday report with this id');
    }

    const { date_name } = report;

    return await this.showBirthdayReportWithYear(report.user, {
      birthday: date_name,
    });
  }

  async getRelationshipReport(id: number) {
    if (!id || id < 0 || id === 0) {
      throw new BadRequestException('Please provide id');
    }

    const report = await this.userUnlockedRelationshipsRepository
      .createQueryBuilder('a_user_unlocked_relationships')
      .where('a_user_unlocked_relationships.id = :id', { id })
      .leftJoinAndSelect('a_user_unlocked_relationships.user', 'user')
      .innerJoinAndSelect('user.week_id', 'week_id')
      .getOne();

    if (!report) {
      throw new NotFoundException(
        'There is no relationship report with this id',
      );
    }

    const { date_name_1, date_name_2 } = report;

    return await this.showRelationshipReport(report.user, {
      birthday_1: date_name_1,
      birthday_2: date_name_2,
    });
  }

  async myFriendsWithPagination(
    user: User,
    page: number,
  ): Promise<MyFriendsResponse[]> {
    const take = 15;
    if (isNaN(page) || page < 1) page = 1;
    const { id } = user;

    try {
      const friends = await this.userFriendRequestsRepository
        .createQueryBuilder('a_user_friend_requests')
        .select([
          'a_user_friend_requests.id',
          'send_by.id',
          'send_by.name',
          'send_to.id',
          'send_to.name',
          'send_by_week_id.id',
          'send_to_week_id.id',
        ])
        .addSelect(['a_user_friend_requests.updatedAt'])
        .where(
          'a_user_friend_requests.send_by = :id AND a_user_friend_requests.status = :status OR a_user_friend_requests.send_to = :id AND a_user_friend_requests.status = :status',
          { id, status: 'accepted' },
        )
        .leftJoin('a_user_friend_requests.send_by', 'send_by')
        .leftJoin('a_user_friend_requests.send_to', 'send_to')
        .innerJoin('send_by.week_id', 'send_by_week_id')
        .innerJoin('send_to.week_id', 'send_to_week_id')
        .orderBy('a_user_friend_requests.updatedAt', 'DESC')
        .skip(take * (Number(page) - 1))
        .take(take)
        .getMany();

      let friendsMap: any = new Map();

      friends.forEach(async (fr) => {
        friendsMap
          .set(fr.send_by.id, fr.send_by)
          .set(fr.send_to.id, fr.send_to);
      });

      friendsMap = Array.from(friendsMap.values());
      friendsMap = friendsMap.filter((f: any) => f.id !== id);

      friendsMap = await async.map(friendsMap, async (friend) => {
        let week1: number, week2: number;

        if (user.week_id.id < friend.week_id.id) {
          week1 = user.week_id.id;
          week2 = friend.week_id.id;
        } else {
          week1 = friend.week_id.id;
          week2 = user.week_id.id;
        }
        const relationship = await this.relationshipRepository
          .createQueryBuilder('c_relationship')
          .where(
            'c_relationship.week1 = :week1 AND c_relationship.week2 = :week2',
            {
              week1,
              week2,
            },
          )
          .select(['c_relationship.ideal'])
          .getOne();

        return {
          id: friend.id,
          name: friend.name,
          image: friend.image.replace('?tr=w-600,h-600', '?tr=w-50,h-50'),
          ideal: relationship.ideal,
        };
      });

      return friendsMap;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async pendingRequestsWithPagination(
    user: User,
    page: number,
  ): Promise<MyFriendsResponse[]> {
    const take = 15;
    if (isNaN(page) || page < 1) page = 1;
    const { id } = user;

    try {
      const friends = await this.userFriendRequestsRepository
        .createQueryBuilder('a_user_friend_requests')
        .select([
          'a_user_friend_requests.id',
          'send_by.id',
          'send_by.name',
          'send_to.id',
          'send_to.name',
          'send_by_week_id.id',
          'send_to_week_id.id',
        ])
        .addSelect(['a_user_friend_requests.updatedAt'])
        .where(
          'a_user_friend_requests.send_by = :id AND a_user_friend_requests.status = :status',
          { id, status: 'pending' },
        )
        .leftJoin('a_user_friend_requests.send_by', 'send_by')
        .leftJoin('a_user_friend_requests.send_to', 'send_to')
        .innerJoin('send_by.week_id', 'send_by_week_id')
        .innerJoin('send_to.week_id', 'send_to_week_id')
        .orderBy('a_user_friend_requests.updatedAt', 'DESC')
        .skip(take * (Number(page) - 1))
        .take(take)
        .getMany();

      let friendsMap: any = new Map();

      friends.forEach(async (fr) => {
        friendsMap
          .set(fr.send_by.id, fr.send_by)
          .set(fr.send_to.id, fr.send_to);
      });

      friendsMap = Array.from(friendsMap.values());
      friendsMap = friendsMap.filter((f: any) => f.id !== id);

      friendsMap = await async.map(friendsMap, async (friend) => {
        let week1: number, week2: number;

        if (user.week_id.id < friend.week_id.id) {
          week1 = user.week_id.id;
          week2 = friend.week_id.id;
        } else {
          week1 = friend.week_id.id;
          week2 = user.week_id.id;
        }

        const relationship = await this.relationshipRepository
          .createQueryBuilder('c_relationship')
          .where(
            'c_relationship.week1 = :week1 AND c_relationship.week2 = :week2',
            {
              week1,
              week2,
            },
          )
          .select(['c_relationship.ideal'])
          .getOne();

        return {
          id: friend.id,
          name: friend.name,
          image: friend.image.replace('?tr=w-600,h-600', '?tr=w-50,h-50'),
          ideal: relationship.ideal,
        };
      });

      return friendsMap;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async myRequestsWithPagination(
    user: User,
    page: number,
  ): Promise<MyFriendsResponse[]> {
    const take = 15;
    if (isNaN(page) || page < 1) page = 1;
    const { id } = user;

    try {
      const friends = await this.userFriendRequestsRepository
        .createQueryBuilder('a_user_friend_requests')
        .select([
          'a_user_friend_requests.id',
          'send_by.id',
          'send_by.name',
          'send_to.id',
          'send_to.name',
          'send_by_week_id.id',
          'send_to_week_id.id',
        ])
        .addSelect(['a_user_friend_requests.updatedAt'])
        .where(
          'a_user_friend_requests.send_to = :id AND a_user_friend_requests.status = :status',
          { id, status: 'pending' },
        )
        .leftJoin('a_user_friend_requests.send_by', 'send_by')
        .leftJoin('a_user_friend_requests.send_to', 'send_to')
        .innerJoin('send_by.week_id', 'send_by_week_id')
        .innerJoin('send_to.week_id', 'send_to_week_id')
        .orderBy('a_user_friend_requests.updatedAt', 'DESC')
        .skip(take * (Number(page) - 1))
        .take(take)
        .getMany();

      let friendsMap: any = new Map();

      friends.forEach(async (fr) => {
        friendsMap
          .set(fr.send_by.id, fr.send_by)
          .set(fr.send_to.id, fr.send_to);
      });

      friendsMap = Array.from(friendsMap.values());
      friendsMap = friendsMap.filter((f: any) => f.id !== id);

      friendsMap = await async.map(friendsMap, async (friend) => {
        let week1: number, week2: number;

        if (user.week_id.id < friend.week_id.id) {
          week1 = user.week_id.id;
          week2 = friend.week_id.id;
        } else {
          week1 = friend.week_id.id;
          week2 = user.week_id.id;
        }
        const relationship = await this.relationshipRepository
          .createQueryBuilder('c_relationship')
          .where(
            'c_relationship.week1 = :week1 AND c_relationship.week2 = :week2',
            {
              week1,
              week2,
            },
          )
          .select(['c_relationship.ideal'])
          .getOne();

        return {
          id: friend.id,
          name: friend.name,
          image: friend.image.replace('?tr=w-600,h-600', '?tr=w-50,h-50'),
          ideal: relationship.ideal,
        };
      });

      return friendsMap;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async addSwipeLeftUser(
    user: User,
    body: AddUserLeftSwipeDto,
  ): Promise<GlobalResponse> {
    const swiped_by: any = user.id;
    const swiped_to: any = body.id;
    if (!swiped_by || !swiped_to || user.id === body.id) {
      throw new BadRequestException('Please provide user id');
    }

    const checkUser = await this.userRepository
      .createQueryBuilder('a_users')
      .select([
        'a_users.id',
        'a_users.name',
        'a_users.username',
        'a_users.instagram',
        'a_users.device_token',
        'a_users.date_name',
      ])
      .where('a_users.id = :id', { id: Number(swiped_to) })
      .leftJoinAndSelect('a_users.week_id', 'week_id')
      .getOne();

    if (!checkUser) {
      throw new NotFoundException('There is no user with this id');
    }

    const request = await this.userFriendRequestsRepository
      .createQueryBuilder('a_user_friend_requests')
      .where(
        'a_user_friend_requests.send_by = :swiped_by AND a_user_friend_requests.send_to = :swiped_to AND a_user_friend_requests.status = :status OR a_user_friend_requests.send_by = :swiped_to AND a_user_friend_requests.send_to = :swiped_by AND a_user_friend_requests.status = :status',
        { swiped_by, swiped_to, status: 'pending' },
      )
      .select(['a_user_friend_requests.id', 'a_user_friend_requests.status'])
      .getOne();

    if (request && request.status === 'pending') {
      request.status = FriendRequestStatus.REJECTED;
      await request.save();

      const pendingRequests = await this.pendingRequestsWithPagination(
        checkUser,
        1,
      );

      this.pusherService.trigger(
        checkUser.username,
        'pendingRequests',
        pendingRequests,
      );

      return {
        status: 'success',
        message: 'Friend request rejected',
      };
    }

    const query =
      this.userLeftSwipesRepository.createQueryBuilder('a_user_left_swipes');

    const check = await query
      .where(
        'a_user_left_swipes.swiped_by = :swiped_by AND a_user_left_swipes.swiped_to = :swiped_to',
        {
          swiped_by,
          swiped_to,
        },
      )
      .getCount();

    if (check === 0) {
      try {
        await query
          .insert()
          .into(UserLeftSwipes)
          .values([{ swiped_by, swiped_to }])
          .execute();
      } catch (e) {
        throw new InternalServerErrorException(e.message);
      }

      return {
        status: 'success',
        message: 'User left swipe was successfully added',
      };
    } else {
      return {
        status: 'success',
        message: 'User left swipe already exist',
      };
    }
  }

  async sendFriendRequest(
    user: User,
    body: SendFriendRequestDto,
  ): Promise<GlobalResponse> {
    const send_by: any = user.id;
    const send_to: any = body.id;
    if (!send_by || !send_to || user.id === body.id) {
      throw new BadRequestException('Please provide user id');
    }

    const checkUser = await this.userRepository
      .createQueryBuilder('a_users')
      .select([
        'a_users.id',
        'a_users.name',
        'a_users.username',
        'a_users.instagram',
        'a_users.device_token',
        'a_users.date_name',
      ])
      .where('a_users.id = :id', { id: Number(send_to) })
      .leftJoinAndSelect('a_users.week_id', 'week_id')
      .getOne();

    if (!checkUser) {
      throw new NotFoundException('There is no user with this id');
    }

    const query = this.userFriendRequestsRepository.createQueryBuilder(
      'a_user_friend_requests',
    );

    const checkRejectedRequest = await query
      .where(
        'a_user_friend_requests.send_by = :send_by AND a_user_friend_requests.send_to = :send_to AND a_user_friend_requests.status = :status OR a_user_friend_requests.send_by = :send_to AND a_user_friend_requests.send_to = :send_by AND a_user_friend_requests.status = :status',
        { send_by, send_to, status: 'rejected' },
      )
      .select(['a_user_friend_requests.id', 'a_user_friend_requests.status'])
      .getOne();

    if (checkRejectedRequest) {
      try {
        await checkRejectedRequest.remove();
      } catch (err) {
        throw new BadRequestException(err.message);
      }
    }

    const checkFriendRequest = await query
      .where(
        'a_user_friend_requests.send_by = :send_by AND a_user_friend_requests.send_to = :send_to AND a_user_friend_requests.status = :status OR a_user_friend_requests.send_by = :send_to AND a_user_friend_requests.send_to = :send_by AND a_user_friend_requests.status = :status',
        { send_by, send_to, status: 'pending' },
      )
      .leftJoinAndSelect('a_user_friend_requests.send_by', 'send_by')
      .leftJoinAndSelect('a_user_friend_requests.send_to', 'send_to')
      .getOne();

    if (
      checkFriendRequest &&
      checkFriendRequest.status &&
      checkFriendRequest.status === 'pending' &&
      checkFriendRequest.send_to &&
      checkFriendRequest.send_to.id === user.id
    ) {
      try {
        checkFriendRequest.status = FriendRequestStatus.ACCEPTED;
        await checkFriendRequest.save();

        const checkChat = await this.chatRepository
          .createQueryBuilder('a_chats')
          .where('a_chats.users @> :users', {
            users: [user.id, Number(body.id)],
          })
          .getCount();

        if (checkChat === 0) {
          this.chatRepository
            .createQueryBuilder('a_chats')
            .insert()
            .into(Chat)
            .values([
              {
                chatName: `${user.name} + ${checkUser.name}`,
                users: [user.id, checkUser.id],
              },
            ])
            .execute();
        }

        const [getFriendRequests, userFriends, pendingRequests] =
          await Promise.all([
            await this.friendsRequestsCounts(checkUser),
            await this.myFriendsWithPagination(checkUser, 1),
            await this.pendingRequestsWithPagination(checkUser, 1),
          ]);
        this.pusherService.trigger(
          checkUser.username,
          'getMe',
          getFriendRequests,
        );
        this.pusherService.trigger(
          checkUser.username,
          'myFriends',
          userFriends,
        );
        this.pusherService.trigger(
          checkUser.username,
          'pendingRequests',
          pendingRequests,
        );

        if (checkUser.device_token)
          this.notificationService.sendNotification(
            'Request Accepted',
            `${user.name} has accepted the friend request`,
            checkUser.device_token,
          );

        return {
          status: 'success',
          message: 'Friend request accepted',
        };
      } catch (err) {
        throw new BadRequestException(err.message);
      }
    }

    const checkFriendRequestStatus = await query
      .where(
        'a_user_friend_requests.send_by = :send_by AND a_user_friend_requests.send_to = :send_to AND a_user_friend_requests.status IN(:...status) OR a_user_friend_requests.send_by = :send_to AND a_user_friend_requests.send_to = :send_by AND a_user_friend_requests.status IN(:...status)',
        { send_by, send_to, status: ['accepted', 'rejected'] },
      )
      .select(['a_user_friend_requests.status'])
      .getOne();

    if (
      checkFriendRequestStatus &&
      checkFriendRequestStatus.status === 'accepted'
    ) {
      throw new BadRequestException(
        `You can't send a friend request. That user is already your friend`,
      );
    }

    try {
      const check = await query
        .where(
          'a_user_friend_requests.send_by = :send_by AND a_user_friend_requests.send_to = :send_to',
          { send_by, send_to },
        )
        .getCount();

      if (check === 0) {
        try {
          await query
            .insert()
            .into(UserFriendRequests)
            .values([{ send_by, send_to }])
            .execute();

          const [getFriendRequests, myRequests] = await Promise.all([
            await this.friendsRequestsCounts(checkUser),
            await this.myRequestsWithPagination(checkUser, 1),
          ]);

          this.pusherService.trigger(
            checkUser.username,
            'getMe',
            getFriendRequests,
          );
          this.pusherService.trigger(
            checkUser.username,
            'myRequests',
            myRequests,
          );

          if (checkUser.device_token)
            this.notificationService.sendNotification(
              'Received Request',
              `${user.name} has sent a friend request`,
              checkUser.device_token,
            );

          return {
            status: 'success',
            message: 'Friend request was successfully sent',
          };
        } catch (err) {
          throw new BadRequestException(err.message);
        }
      } else {
        throw new BadRequestException('Friend request already sent');
      }
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async deleteFriend(
    user: User,
    body: SendFriendRequestDto,
  ): Promise<GlobalResponse> {
    const myId: number = user.id;
    const { id } = body;
    if (user.id === id) {
      throw new BadRequestException('Please use /user/me route');
    }

    if (!id) {
      throw new BadRequestException('Please provide user id');
    }

    const checkUser = await this.userRepository
      .createQueryBuilder('a_users')
      .select([
        'a_users.id',
        'a_users.name',
        'a_users.username',
        'a_users.instagram',
        'a_users.device_token',
        'a_users.date_name',
      ])
      .where('a_users.id = :id', { id })
      .leftJoinAndSelect('a_users.week_id', 'week_id')
      .getOne();

    if (!checkUser) {
      throw new NotFoundException('There is no user with this id');
    }

    const query = this.userFriendRequestsRepository.createQueryBuilder(
      'a_user_friend_requests',
    );

    try {
      await query
        .delete()
        .from(UserFriendRequests)
        .where(
          'a_user_friend_requests.send_by = :myId AND a_user_friend_requests.send_to = :id AND a_user_friend_requests.status = :status OR a_user_friend_requests.send_by = :id AND a_user_friend_requests.send_to = :myId AND a_user_friend_requests.status = :status',
          { myId, id, status: 'accepted' },
        )
        .execute();

      await this.chatRepository
        .createQueryBuilder('a_chats')
        .delete()
        .where('a_chats.users @> :id', { id: [myId, checkUser.id] })
        .execute();

      const [userFriends, myFriends, otherUsernameChats] = await Promise.all([
        await this.myFriendsWithPagination(checkUser, 1),
        await this.myFriendsWithPagination(user, 1),
        await this.chatService.getOtherUserChatsWithPagination(checkUser, 1),
      ]);

      this.pusherService.trigger(
        checkUser.username,
        'chats',
        otherUsernameChats,
      );
      this.pusherService.trigger(checkUser.username, 'myFriends', userFriends);
      this.pusherService.trigger(user.username, 'myFriends', myFriends);

      return {
        status: 'success',
        message: 'Friend was successfully deleted',
      };
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async withdrawFriendRequest(
    user: User,
    body: SendFriendRequestDto,
  ): Promise<GlobalResponse> {
    const send_by: any = user.id;
    const send_to: any = body.id;
    if (!send_by || !send_to || user.id === body.id) {
      throw new BadRequestException('Please provide user id');
    }

    const checkUser = await this.userRepository
      .createQueryBuilder('a_users')
      .select([
        'a_users.id',
        'a_users.name',
        'a_users.username',
        'a_users.instagram',
        'a_users.device_token',
        'a_users.date_name',
      ])
      .where('a_users.id = :id', { id: send_to })
      .leftJoinAndSelect('a_users.week_id', 'week_id')
      .getOne();

    if (!checkUser) {
      throw new NotFoundException('There is no user with this id');
    }

    try {
      await this.userFriendRequestsRepository
        .createQueryBuilder('a_user_friend_requests')
        .delete()
        .where(
          'a_user_friend_requests.send_by = :send_by AND a_user_friend_requests.send_to = :send_to',
          { send_by, send_to },
        )
        .execute();

      const [getFriendRequests, myRequests, pendingRequests] =
        await Promise.all([
          await this.friendsRequestsCounts(checkUser),
          await this.myRequestsWithPagination(checkUser, 1),
          await this.pendingRequestsWithPagination(user, 1),
        ]);
      this.pusherService.trigger(
        checkUser.username,
        'getMe',
        getFriendRequests,
      );
      this.pusherService.trigger(checkUser.username, 'myRequests', myRequests);
      this.pusherService.trigger(
        user.username,
        'pendingRequests',
        pendingRequests,
      );

      return {
        status: 'success',
        message: 'Friend request successfully withdraw',
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async acceptFriendRequest(
    user: User,
    body: SendFriendRequestDto,
  ): Promise<GlobalResponse> {
    const send_by: any = body.id;
    const send_to: any = user.id;
    if (!send_by || !send_to || user.id === body.id) {
      throw new BadRequestException('Please provide user id');
    }

    const checkUser = await this.userRepository
      .createQueryBuilder('a_users')
      .select([
        'a_users.id',
        'a_users.name',
        'a_users.username',
        'a_users.instagram',
        'a_users.device_token',
        'a_users.date_name',
      ])
      .where('a_users.id = :id', { id: send_by })
      .leftJoinAndSelect('a_users.week_id', 'week_id')
      .getOne();

    if (!checkUser) {
      throw new NotFoundException('There is no user with this id');
    }

    try {
      const request = await this.userFriendRequestsRepository
        .createQueryBuilder('a_user_friend_requests')
        .where(
          'a_user_friend_requests.send_by = :send_by AND a_user_friend_requests.send_to = :send_to AND a_user_friend_requests.status = :status',
          { send_by, send_to, status: 'pending' },
        )
        .update()
        .set({
          status: FriendRequestStatus.ACCEPTED,
        })
        .returning('*')
        .execute()
        .then((response) => response.raw[0]);

      if (request) {
        const [getFriendRequests, pendingRequests, myRequests, checkChat] =
          await Promise.all([
            await this.friendsRequestsCounts(checkUser),
            await this.pendingRequestsWithPagination(checkUser, 1),
            await this.myRequestsWithPagination(user, 1),
            await this.chatRepository
              .createQueryBuilder('a_chats')
              .where('a_chats.users @> :users', {
                users: [user.id, checkUser.id],
              })
              .getCount(),
          ]);

        if (checkChat === 0) {
          this.chatRepository
            .createQueryBuilder('a_chats')
            .insert()
            .into(Chat)
            .values([
              {
                chatName: `${user.name} + ${checkUser.name}`,
                users: [user.id, checkUser.id],
              },
            ])
            .execute();
        }

        this.pusherService.trigger(
          checkUser.username,
          'getMe',
          getFriendRequests,
        );
        this.pusherService.trigger(
          checkUser.username,
          'pendingRequests',
          pendingRequests,
        );
        this.pusherService.trigger(user.username, 'myRequests', myRequests);

        if (checkUser.device_token)
          this.notificationService.sendNotification(
            'Request Accepted',
            `${user.name} has accepted the friend request`,
            checkUser.device_token,
          );

        return {
          status: 'success',
          message: 'Friend request successfully accepted',
        };
      } else {
        throw new BadRequestException('There is no friend request');
      }
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async rejectFriendRequest(
    user: User,
    body: SendFriendRequestDto,
  ): Promise<GlobalResponse> {
    const send_by: any = body.id;
    const send_to: any = user.id;
    if (!send_by || !send_to || user.id === body.id) {
      throw new BadRequestException('Please provide user id');
    }

    const checkUser = await this.userRepository
      .createQueryBuilder('a_users')
      .select([
        'a_users.id',
        'a_users.name',
        'a_users.username',
        'a_users.instagram',
        'a_users.device_token',
        'a_users.date_name',
      ])
      .where('a_users.id = :id', { id: send_by })
      .leftJoinAndSelect('a_users.week_id', 'week_id')
      .getOne();

    if (!checkUser) {
      throw new NotFoundException('There is no user with this id');
    }

    try {
      const request = await this.userFriendRequestsRepository
        .createQueryBuilder('a_user_friend_requests')
        .where(
          'a_user_friend_requests.send_by = :send_by AND a_user_friend_requests.send_to = :send_to AND a_user_friend_requests.status = :status',
          { send_by, send_to, status: 'pending' },
        )
        .update()
        .set({
          status: FriendRequestStatus.REJECTED,
        })
        .returning('*')
        .execute()
        .then((response) => response.raw[0]);

      if (request) {
        const [getFriendRequests, pendingRequests, myRequests] =
          await Promise.all([
            await this.friendsRequestsCounts(checkUser),
            await this.pendingRequestsWithPagination(checkUser, 1),
            await this.myRequestsWithPagination(user, 1),
          ]);

        this.pusherService.trigger(
          checkUser.username,
          'getMe',
          getFriendRequests,
        );
        this.pusherService.trigger(
          checkUser.username,
          'pendingRequests',
          pendingRequests,
        );
        this.pusherService.trigger(user.username, 'myRequests', myRequests);

        return {
          status: 'success',
          message: 'Friend request successfully rejected',
        };
      } else {
        throw new BadRequestException('There is no friend request');
      }
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async friendsRequestsCounts(
    user: User,
  ): Promise<FriendsRequestsCountsResponse> {
    const { id } = user;

    const query = this.userFriendRequestsRepository.createQueryBuilder(
      'a_user_friend_requests',
    );

    try {
      const [friendsCount, pendingsCount, requestsCount] = await Promise.all([
        await query
          .where(
            'a_user_friend_requests.send_by = :id AND a_user_friend_requests.status = :status OR a_user_friend_requests.send_to = :id AND a_user_friend_requests.status = :status',
            {
              id,
              status: 'accepted',
            },
          )
          .getCount(),
        await query
          .where(
            'a_user_friend_requests.send_by = :id AND a_user_friend_requests.status = :status',
            {
              id,
              status: 'pending',
            },
          )
          .getCount(),
        await query
          .where(
            'a_user_friend_requests.send_to = :id AND a_user_friend_requests.status = :status',
            {
              id,
              status: 'pending',
            },
          )
          .getCount(),
      ]);

      return {
        friends: Number(friendsCount) || 0,
        pending: Number(pendingsCount) || 0,
        requests: Number(requestsCount) || 0,
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async addUserLocation(
    user: User,
    body: AddUserLocationDto,
  ): Promise<GlobalResponse> {
    if (user.user_type !== 2) {
      user.locationEdittedByUser = false;
    }

    if (user.locationEdittedByUser) {
      return {
        status: 'success',
        message: 'Location editted by user',
      };
    }

    const { lat, lng } = body;

    if (
      Number(lat).toFixed(2) === (0).toFixed(2) &&
      Number(lng).toFixed(2) === (0).toFixed(2)
    ) {
      return {
        status: 'conflict',
        message: 'Lng and lat is equal to 0',
      };
    }

    try {
      user.location = { type: 'Point', coordinates: [lng, lat] };
      const data = await this.helperService.getCity(Number(lng), Number(lat));

      if (data && data[0] && data[0].city)
        if (user.city !== data[0].city) {
          user.city = data[0].city;
          user.address = data[0].formattedAddress;
        }

      user.locationEdittedByUser = false;
      await user.save();
      return {
        status: 'success',
        message: 'User location was successfully updated',
      };
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async searchUsersWithPaginate(
    user: User,
    body: SearchUsersDto,
    offset: number,
  ): Promise<User[]> {
    let users: User[];
    if (isNaN(offset) || offset < 1) offset = 1;
    const gender: number = body.gender;
    const interestedIn: number = body.interestedIn;
    const idealFor: string[] = body.idealFor;
    const minAge: number = body.minAge || 17;
    const maxAge: number = body.maxAge || 100;
    const range: number = body.range || 50000;
    const { week_id, date_name } = user;
    const my_birthday_name: string = week_id.name_short;
    let categoryWeekIdFilter = [];
    let notIncludedUsersId = [user.id];

    switch (interestedIn) {
      case 1:
        categoryWeekIdFilter = categoryWeekIdFilter.concat(
          user.romance_filter.split(','),
        );
        break;
      case 2:
        categoryWeekIdFilter = categoryWeekIdFilter.concat(
          user.friendship_filter.split(','),
        );
        break;
      case 3:
        categoryWeekIdFilter = categoryWeekIdFilter.concat(
          user.business_filter.split(','),
        );
        break;
      default:
        categoryWeekIdFilter = [
          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
          21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
          38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48,
        ];
        break;
    }

    const [friends, swipeLeftUsers, blockedUsers] = await Promise.all([
      await this.userFriendRequestsRepository
        .createQueryBuilder('a_user_friend_requests')
        .where(
          'a_user_friend_requests.send_by = :id OR a_user_friend_requests.send_to = :id',
          { id: user.id },
        )
        .select([
          'a_user_friend_requests.send_by',
          'a_user_friend_requests.send_to',
        ])
        .getMany(),
      await this.userLeftSwipesRepository
        .createQueryBuilder('a_user_left_swipes')
        .select([
          'a_user_left_swipes.swiped_by',
          'a_user_left_swipes.swiped_to',
        ])
        .where('a_user_left_swipes.swiped_by = :id', { id: user.id })
        .getMany(),
      await this.blockedRepository
        .createQueryBuilder('a_user_blocked')
        .select(['a_user_blocked.blocked_by', 'a_user_blocked.blocked_to'])
        .where(
          'a_user_blocked.blocked_by = :id OR a_user_blocked.blocked_to = :id',
          { id: user.id },
        )
        .getMany(),
    ]);

    // Exclude friends and friend requests
    let friendsMap: any = new Set(),
      leftUsersMap: any = new Set(),
      blocksMap: any = new Set();

    friends.forEach(async (fr) => {
      friendsMap.add(fr.send_by).add(fr.send_to);
    });
    friendsMap = Array.from(friendsMap.values()).filter(
      (f: any) => f !== user.id,
    );
    if (friendsMap.length > 0) {
      notIncludedUsersId = notIncludedUsersId.concat(friendsMap);
    }

    swipeLeftUsers.forEach(async (fr) => {
      leftUsersMap.add(fr.swiped_by).add(fr.swiped_to);
    });
    leftUsersMap = Array.from(leftUsersMap.values()).filter(
      (f: any) => f !== user.id,
    );
    if (leftUsersMap.length > 0) {
      notIncludedUsersId = notIncludedUsersId.concat(leftUsersMap);
    }

    blockedUsers.forEach(async (fr) => {
      blocksMap.add(fr.blocked_by).add(fr.blocked_to);
    });
    blocksMap = Array.from(blocksMap.values()).filter(
      (f: any) => f !== user.id,
    );
    if (blocksMap.length > 0) {
      notIncludedUsersId = notIncludedUsersId.concat(blocksMap);
    }

    let usQueryString = 'a_users.week_id IN(:...week_id)';
    let usQueryObject: any = { week_id: categoryWeekIdFilter };

    if (gender && gender !== 0) {
      usQueryString += ' AND a_users.gender = :gender';
      usQueryObject = { ...usQueryObject, gender };
    }

    if (notIncludedUsersId.length > 0) {
      usQueryString += ' AND a_users.id NOT IN(:...ids)';
      usQueryObject = { ...usQueryObject, ids: notIncludedUsersId };
    }

    let rel: any;
    if (user.location) {
      [users, rel] = await Promise.all([
        await this.userRepository
          .createQueryBuilder('a_users')
          .select([
            'a_users.id',
            'a_users.username',
            'a_users.instagram',
            'a_users.name',
            'a_users.location',
            'a_users.city',
            'a_users.country_name',
            'a_users.createdAt',
            'a_users.dob',
            'a_users.date_name',
            'a_users.sln',
            'a_users.gender_preference',
            'a_users.age',
            'a_users.hasProfilePicture',
            'a_users.attractive',
            'week_id.id',
            'week_id.name_short',
            'gender.gender_name',
            'interested_in.name',
            'ST_Distance(a_users.location, ST_SetSRID(ST_GeomFromGeoJSON(:origin), ST_SRID(a_users.location)))*62.5 AS distance',
          ])
          .where(usQueryString, usQueryObject)
          .andWhere('a_users.hasProfilePicture = true')
          .andWhere('a_users.age BETWEEN :minAge AND :maxAge', {
            minAge,
            maxAge,
          })
          .andWhere(
            'ST_DWithin(a_users.location, ST_SetSRID(ST_GeomFromGeoJSON(:origin), ST_SRID(a_users.location)), :range)',
          )
          .orderBy('distance', 'ASC')
          .addOrderBy('a_users.attractive', 'DESC')
          .setParameters({
            // stringify GeoJSON
            origin: JSON.stringify(user.location),
            range: range / 62.5, //KM conversion
          })
          .limit(5)
          .leftJoin('a_users.gender', 'gender')
          .leftJoin('a_users.interested_in', 'interested_in')
          .leftJoin('a_users.week_id', 'week_id')
          .getRawMany(),
        await this.relationshipRepository
          .createQueryBuilder('c_relationship')
          .where(
            'c_relationship.week1 = :userWeekId AND c_relationship.week2 IN(:...categoryWeekIdFilter) OR c_relationship.week2 = :userWeekId AND c_relationship.week1 IN(:...categoryWeekIdFilter)',
            {
              userWeekId: user.week_id.id,
              categoryWeekIdFilter,
            },
          )
          .getMany(),
      ]);

      if (!(users.length > 0)) {
        return [];
      }

      users.reverse();

      let slnSet: any = new Set();
      users.forEach((u: any) => {
        slnSet.add(u.a_users_sln);
      });
      slnSet = Array.from(slnSet.values());

      const c_dates: any = await this.dateRepository
        .createQueryBuilder('c_date')
        .select(['c_date.y8', 'day_id.id', 'c_date.sln'])
        .where('c_date.sln IN(:...sln)', { sln: slnSet })
        .leftJoin('c_date.day_id', 'day_id')
        .getMany();

      users = await async.map(users, async (u: any) => {
        let week1: number, week2: number;
        const user_birthday_name: string = u.week_id_name_short;

        const distance = u.a_users_city
          ? Number(u.distance.toFixed(0)) < 1
            ? `less than a mile away`
            : `${u.a_users_city}, ${u.distance.toFixed(0)}.0 miles away`
          : u.a_users_country_name;

        if (week_id.id < u.week_id_id) {
          week1 = week_id.id;
          week2 = u.week_id_id;
        } else {
          week1 = u.week_id_id;
          week2 = week_id.id;
        }

        const ideal = rel.find((r) => r.week1 === week1 && r.week2 === week2);
        const c_date = c_dates.filter((c) => c.sln === u.a_users_sln);

        // if (idealFor.length > 0) {
        //   relQueryString += ' AND c_relationship.ideal IN(:...idealFor)';
        //   relQueryObject = { ...relQueryObject, idealFor };
        // }

        if (c_date) {
          const images = await this.userImagesRepository
            .createQueryBuilder('a_user_images')
            .where('a_user_images.user = :id', { id: u.a_users_id })
            .getMany();

          return {
            id: u.a_users_id,
            username: u.a_users_username,
            instagram: u.a_users_instagram,
            name: u.a_users_name,
            age: moment().diff(
              moment(u.a_users_date_name, 'MMM DD, YYYY').format('YYYY-MM-DD'),
              'years',
            ),
            signUpDate: `Joined ${moment(u.a_users_createdAt).format(
              'MMM DD, YYYY',
            )}`,
            user_birthday: u.a_users_date_name.split(',')[0],
            user_birthday_name,
            sln: u.a_users_sln,
            sln_description:
              'This name describes the life energy of this day. People born during this day will retain and radiate its energy and will exhibit most of the personality traits we discovered for their day, week, month, season, and year as shown b...',
            image: u.a_users_image,
            images:
              images.length > 0
                ? images.sort(function (x, y) {
                    return x.is_profile_pic === y.is_profile_pic
                      ? 0
                      : x
                      ? -1
                      : 1;
                  })
                : [
                    {
                      id: 0,
                      image: `${process.env.IMAGE_KIT}default.png?tr=w-600,h-600`,
                      is_profile_pic: true,
                    },
                  ],
            rel_image: ideal.image,
            my_birthday: date_name,
            my_birthday_name,
            ideal_for: ideal.ideal,
            looking_for: `${u.gender_gender_name} looking for ${
              u.a_users_gender_preference === 0
                ? 'Everyone'
                : u.a_users_gender_preference === 1
                ? 'Male'
                : 'Female'
            } in ${u.interested_in_name}`,
            report: this.helperService.clearText(ideal.report),
            advice: this.helperService.clearText(ideal.advice),
            famous_years: c_date
              .map((f: any) => {
                if (Number(String(f.y8).substring(0, 4)) < moment().year())
                  return String(f.y8).substring(0, 4);
                else return '';
              })
              .filter((f: any) => f !== '')
              .sort()
              .join(', '),
            distance: distance,
          };
        }
      });
    } else {
      [users, rel] = await Promise.all([
        await this.userRepository
          .createQueryBuilder('a_users')
          .select([
            'a_users.id',
            'a_users.username',
            'a_users.instagram',
            'a_users.name',
            'a_users.location',
            'a_users.city',
            'a_users.country_name',
            'a_users.createdAt',
            'a_users.dob',
            'a_users.date_name',
            'a_users.sln',
            'a_users.gender_preference',
            'a_users.attractive',
            'a_users.age',
            'a_users.hasProfilePicture',
            'a_users.attractive',
            'week_id.id',
            'week_id.name_short',
            'gender.gender_name',
            'interested_in.name',
          ])
          .where(usQueryString, usQueryObject)
          .andWhere('a_users.hasProfilePicture = true')
          .andWhere('a_users.age BETWEEN :minAge AND :maxAge', {
            minAge,
            maxAge,
          })
          .orderBy('a_users.attractive', 'DESC')
          .addOrderBy('a_users.id', 'DESC')
          .take(5)
          .leftJoin('a_users.gender', 'gender')
          .leftJoin('a_users.interested_in', 'interested_in')
          .leftJoin('a_users.week_id', 'week_id')
          .leftJoinAndSelect('a_users.images', 'images')
          .getMany(),
        await this.relationshipRepository
          .createQueryBuilder('c_relationship')
          .where(
            'c_relationship.week1 = :userWeekId AND c_relationship.week2 IN(:...categoryWeekIdFilter) OR c_relationship.week2 = :userWeekId AND c_relationship.week1 IN(:...categoryWeekIdFilter)',
            {
              userWeekId: user.week_id.id,
              categoryWeekIdFilter,
            },
          )
          .getMany(),
      ]);

      if (!(users.length > 0)) {
        return [];
      }

      users.reverse();
      let slnSet: any = new Set();
      users.forEach((u: any) => {
        slnSet.add(u.sln);
      });
      slnSet = Array.from(slnSet.values());

      const c_dates: any = await this.dateRepository
        .createQueryBuilder('c_date')
        .select(['c_date.y8', 'day_id.id', 'c_date.sln'])
        .where('c_date.sln IN(:...sln)', { sln: slnSet })
        .leftJoin('c_date.day_id', 'day_id')
        .getMany();

      users = await async.map(users, async (u: User) => {
        let week1: number, week2: number;
        const user_birthday_name: string = u.week_id.name_short;
        const distance =
          u.location && user.location
            ? this.helperService.getDistance(user, u)
            : u.city
            ? u.city
            : u.country_name;

        if (week_id.id < u.week_id.id) {
          week1 = week_id.id;
          week2 = u.week_id.id;
        } else {
          week1 = u.week_id.id;
          week2 = week_id.id;
        }

        // if (idealFor.length > 0) {
        //   relQueryString += ' AND c_relationship.ideal IN(:...idealFor)';
        //   relQueryObject = { ...relQueryObject, idealFor };
        // }
        const ideal = rel.find((r) => r.week1 === week1 && r.week2 === week2);
        const c_date = c_dates.filter((c) => c.sln === u.sln);

        if (c_date) {
          return {
            id: u.id,
            username: u.username,
            instagram: u.instagram,
            name: u.name,
            age: moment().diff(
              moment(u.date_name, 'MMM DD, YYYY').format('YYYY-MM-DD'),
              'years',
            ),
            signUpDate: `Joined ${moment(u.createdAt).format('MMM DD, YYYY')}`,
            user_birthday: u.date_name.split(',')[0],
            user_birthday_name,
            sln: u.sln,
            sln_description:
              'This name describes the life energy of this day. People born during this day will retain and radiate its energy and will exhibit most of the personality traits we discovered for their day, week, month, season, and year as shown b...',
            image: u.image,
            images:
              u.images.length !== 0
                ? u.images.sort(function (x, y) {
                    return x.is_profile_pic === y.is_profile_pic
                      ? 0
                      : x
                      ? -1
                      : 1;
                  })
                : [
                    {
                      id: 0,
                      image: `${process.env.IMAGE_KIT}default.png?tr=w-600,h-600`,
                      is_profile_pic: true,
                    },
                  ],
            rel_image: ideal.image,
            my_birthday: date_name,
            my_birthday_name,
            ideal_for: ideal.ideal,
            looking_for: `${u.gender.gender_name} looking for ${
              u.gender_preference === 0
                ? 'Everyone'
                : u.gender_preference === 1
                ? 'Male'
                : 'Female'
            } in ${u.interested_in.name}`,
            report: this.helperService.clearText(ideal.report),
            advice: this.helperService.clearText(ideal.advice),
            famous_years: c_date
              .map((f: any) => {
                if (Number(String(f.y8).substring(0, 4)) < moment().year())
                  return String(f.y8).substring(0, 4);
                else return '';
              })
              .filter((f: any) => f !== '')
              .sort()
              .join(', '),
            distance,
          };
        }
      });
    }

    return users;
  }

  async searchAllUsers(user: User, body: SearchAllUsersDto): Promise<User[]> {
    let users: User[], rel: any;
    const { id, week_id } = user;
    const input: string = body.input;
    const gender: number = body.gender;
    const interestedIn: number = body.interestedIn;
    const minAge: number = body.minAge || 17;
    const maxAge: number = body.maxAge || 100;
    let notIncludedUsersId = [id];
    let categoryWeekIdFilter = [];

    switch (interestedIn) {
      case 1:
        categoryWeekIdFilter = categoryWeekIdFilter.concat(
          user.romance_filter.split(','),
        );
        break;
      case 2:
        categoryWeekIdFilter = categoryWeekIdFilter.concat(
          user.friendship_filter.split(','),
        );
        break;
      case 3:
        categoryWeekIdFilter = categoryWeekIdFilter.concat(
          user.business_filter.split(','),
        );
        break;
      default:
        categoryWeekIdFilter = [
          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
          21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
          38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48,
        ];
        break;
    }

    // Exclude blocked users
    const blockedUsers = await this.blockedRepository
      .createQueryBuilder('a_user_blocked')
      .select(['a_user_blocked.blocked_by', 'a_user_blocked.blocked_to'])
      .where(
        'a_user_blocked.blocked_by = :id OR a_user_blocked.blocked_to = :id',
        { id },
      )
      .getMany();

    let blocksMap: any = new Set();
    blockedUsers.forEach(async (fr) => {
      blocksMap.add(fr.blocked_by).add(fr.blocked_to);
    });
    blocksMap = Array.from(blocksMap.values()).filter((f: any) => f !== id);
    if (blocksMap.length > 0) {
      notIncludedUsersId = notIncludedUsersId.concat(blocksMap);
    }

    let usQueryString = 'a_users.week_id IN(:...week_id)';
    let usQueryObject: any = { week_id: categoryWeekIdFilter };

    if (gender && gender !== 0) {
      usQueryString += ' AND a_users.gender = :gender';
      usQueryObject = { ...usQueryObject, gender };
    }

    // eslint-disable-next-line prefer-const
    [users, rel] = await Promise.all([
      await this.userRepository
        .createQueryBuilder('a_users')
        .select([
          'a_users.id',
          'a_users.name',
          'a_users.instagram',
          'a_users.date_name',
          'a_users.age',
          'a_users.hasProfilePicture',
          'a_users.attractive',
          'week_id.id',
        ])
        .where(
          'LOWER(a_users.name) LIKE LOWER(:input) AND a_users.id NOT IN(:...ids)',
          { input: `%${input}%`, ids: notIncludedUsersId },
        )
        .andWhere(usQueryString, usQueryObject)
        .andWhere('a_users.age BETWEEN :minAge AND :maxAge', { minAge, maxAge })
        .orderBy('a_users.attractive', 'DESC')
        .addOrderBy('a_users.hasProfilePicture', 'DESC')
        .addOrderBy('a_users.id', 'DESC')
        .leftJoin('a_users.week_id', 'week_id')
        .take(50)
        .getMany(),
      await this.relationshipRepository
        .createQueryBuilder('c_relationship')
        .where(
          'c_relationship.week1 = :userWeekId AND c_relationship.week2 IN(:...categoryWeekIdFilter) OR c_relationship.week2 = :userWeekId AND c_relationship.week1 IN(:...categoryWeekIdFilter)',
          {
            userWeekId: user.week_id.id,
            categoryWeekIdFilter,
          },
        )
        .getMany(),
    ]);

    if (!(users.length > 0)) return [];

    let usersSet: any = new Set();
    users.forEach((u) => usersSet.add(u.id));
    usersSet = Array.from(usersSet.values());

    const requ = await this.userFriendRequestsRepository
      .createQueryBuilder('a_user_friend_requests')
      .where(
        'a_user_friend_requests.send_by = :send_by AND a_user_friend_requests.send_to IN(:...send_to) OR a_user_friend_requests.send_by IN(:...send_to) AND a_user_friend_requests.send_to = :send_by',
        { send_by: user.id, send_to: usersSet },
      )
      .getMany();

    users = await async.map(users, async (u: User) => {
      let week1: number, week2: number, friendStatus: number;

      if (week_id.id < u.week_id.id) {
        week1 = week_id.id;
        week2 = u.week_id.id;
      } else {
        week1 = u.week_id.id;
        week2 = week_id.id;
      }

      const ideal = rel.find((r) => r.week1 === week1 && r.week2 === week2);
      const requestStatus = requ.find(
        (r) =>
          (Number(r.send_by) === u.id && Number(r.send_to) === id) ||
          (Number(r.send_by) === id && Number(r.send_to) === u.id),
      );

      if (!requestStatus) {
        // No friend
        friendStatus = 1;
      } else {
        if (Number(requestStatus.send_by) === u.id) {
          if (requestStatus.status === 'pending') {
            // Accept or reject
            friendStatus = 4;
          } else if (requestStatus.status === 'accepted') {
            // Friend
            friendStatus = 2;
          } else if (requestStatus.status === 'rejected') {
            // No friend
            friendStatus = 1;
          }
        } else if (Number(requestStatus.send_to) === u.id) {
          if (requestStatus.status === 'pending') {
            // I sent friend request
            friendStatus = 3;
          } else if (requestStatus.status === 'accepted') {
            // Friend
            friendStatus = 2;
          } else if (requestStatus.status === 'rejected') {
            friendStatus = 1;
          }
        } else {
          friendStatus = 1;
        }
      }

      return {
        id: u.id,
        name: u.name,
        instagram: u.instagram,
        age: moment().diff(
          moment(u.date_name, 'MMM DD, YYYY').format('YYYY-MM-DD'),
          'years',
        ),
        image: u.image.replace('?tr=w-600,h-600', '?tr=w-50,h-50'),
        ideal: ideal.ideal,
        friendStatus,
      };
    });

    return users;
  }

  async getSuggestions(
    user: User,
    body: GetSuggestionsDto,
  ): Promise<GetSuggestionsInterface[]> {
    const myId = user.id;
    const gender_preference = user.gender_preference;
    let interestedIn: number = body.interestedIn;
    let notIncludedUsersId = [myId];
    let categoryWeekIdFilter = [];
    if (!interestedIn || (interestedIn < 1 && interestedIn > 3))
      interestedIn = 1;

    switch (interestedIn) {
      case 1:
        categoryWeekIdFilter = categoryWeekIdFilter.concat(
          user.romance_filter.split(','),
        );
        break;
      case 2:
        categoryWeekIdFilter = categoryWeekIdFilter.concat(
          user.friendship_filter.split(','),
        );
        break;
      case 3:
        categoryWeekIdFilter = categoryWeekIdFilter.concat(
          user.business_filter.split(','),
        );
        break;
      default:
        categoryWeekIdFilter = [
          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
          21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
          38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48,
        ];
        break;
    }

    const [friends, swipeLeftUsers, blockedUsers] = await Promise.all([
      await this.userFriendRequestsRepository
        .createQueryBuilder('a_user_friend_requests')
        .where(
          'a_user_friend_requests.send_by = :id OR a_user_friend_requests.send_to = :id',
          { id: user.id },
        )
        .select([
          'a_user_friend_requests.send_by',
          'a_user_friend_requests.send_to',
        ])
        .getMany(),
      await this.userLeftSwipesRepository
        .createQueryBuilder('a_user_left_swipes')
        .select([
          'a_user_left_swipes.swiped_by',
          'a_user_left_swipes.swiped_to',
        ])
        .where('a_user_left_swipes.swiped_by = :id', { id: user.id })
        .getMany(),
      await this.blockedRepository
        .createQueryBuilder('a_user_blocked')
        .select(['a_user_blocked.blocked_by', 'a_user_blocked.blocked_to'])
        .where(
          'a_user_blocked.blocked_by = :id OR a_user_blocked.blocked_to = :id',
          { id: user.id },
        )
        .getMany(),
    ]);

    // Exclude friends and friend requests
    let friendsMap: any = new Set(),
      leftUsersMap: any = new Set(),
      blocksMap: any = new Set();

    friends.forEach(async (fr) => {
      friendsMap.add(fr.send_by).add(fr.send_to);
    });
    friendsMap = Array.from(friendsMap.values()).filter(
      (f: any) => f !== user.id,
    );
    if (friendsMap.length > 0) {
      notIncludedUsersId = notIncludedUsersId.concat(friendsMap);
    }

    swipeLeftUsers.forEach(async (fr) => {
      leftUsersMap.add(fr.swiped_by).add(fr.swiped_to);
    });
    leftUsersMap = Array.from(leftUsersMap.values()).filter(
      (f: any) => f !== user.id,
    );
    if (leftUsersMap.length > 0) {
      notIncludedUsersId = notIncludedUsersId.concat(leftUsersMap);
    }

    blockedUsers.forEach(async (fr) => {
      blocksMap.add(fr.blocked_by).add(fr.blocked_to);
    });
    blocksMap = Array.from(blocksMap.values()).filter(
      (f: any) => f !== user.id,
    );
    if (blocksMap.length > 0) {
      notIncludedUsersId = notIncludedUsersId.concat(blocksMap);
    }

    let users: any, rel: any;
    if (gender_preference === 0) {
      [users, rel] = await Promise.all([
        await this.userRepository
          .createQueryBuilder('a_users')
          .where('a_users.week_id IN(:...categoryWeekIdFilter)', {
            categoryWeekIdFilter,
          })
          .andWhere('a_users.id NOT IN(:...ids)', { ids: notIncludedUsersId })
          .orderBy('a_users.attractive', 'DESC')
          .addOrderBy('a_users.hasProfilePicture', 'DESC')
          .addOrderBy('a_users.id', 'DESC')
          .take(50)
          .leftJoinAndSelect('a_users.week_id', 'week_id')
          .getMany(),
        await this.relationshipRepository
          .createQueryBuilder('c_relationship')
          .select([
            'c_relationship.week1',
            'c_relationship.week2',
            'c_relationship.ideal',
          ])
          .where(
            'c_relationship.week1 = :userWeekId AND c_relationship.week2 IN(:...categoryWeekIdFilter) OR c_relationship.week2 = :userWeekId AND c_relationship.week1 IN(:...categoryWeekIdFilter)',
            {
              userWeekId: user.week_id.id,
              categoryWeekIdFilter,
            },
          )
          .getMany(),
      ]);
    } else {
      [users, rel] = await Promise.all([
        await this.userRepository
          .createQueryBuilder('a_users')
          .where('a_users.week_id IN(:...categoryWeekIdFilter)', {
            categoryWeekIdFilter,
          })
          .andWhere('a_users.id NOT IN(:...ids)', { ids: notIncludedUsersId })
          .andWhere('a_users.gender = :gender_preference', {
            gender_preference,
          })
          .orderBy('a_users.attractive', 'DESC')
          .addOrderBy('a_users.hasProfilePicture', 'DESC')
          .addOrderBy('a_users.id', 'DESC')
          .take(50)
          .leftJoinAndSelect('a_users.week_id', 'week_id')
          .getMany(),
        await this.relationshipRepository
          .createQueryBuilder('c_relationship')
          .select([
            'c_relationship.week1',
            'c_relationship.week2',
            'c_relationship.ideal',
          ])
          .where(
            'c_relationship.week1 = :userWeekId AND c_relationship.week2 IN(:...categoryWeekIdFilter) OR c_relationship.week2 = :userWeekId AND c_relationship.week1 IN(:...categoryWeekIdFilter)',
            {
              userWeekId: user.week_id.id,
              categoryWeekIdFilter,
            },
          )
          .getMany(),
      ]);
    }

    // OrderBy image

    users = await async.map(users, async (u: User) => {
      const ideal = rel.find(
        (r) =>
          (r.week1 === user.week_id.id && r.week2 === u.week_id.id) ||
          (r.week2 === user.week_id.id && r.week1 === u.week_id.id),
      );
      return {
        id: u.id,
        name: u.name,
        instagram: u.instagram,
        age: moment().diff(
          moment(u.date_name, 'MMM DD, YYYY').format('YYYY-MM-DD'),
          'years',
        ),
        friendStatus: 1,
        image: u.image.replace('?tr=w-600,h-600', '?tr=w-50,h-50'),
        ideal: ideal.ideal,
      };
    });

    return users;
  }

  async reportUser(user: User, body: ReportedDto): Promise<GlobalResponse> {
    const reported_by: any = user.id;
    const reported_to: any = body.id;

    if (!reported_by || !reported_to || user.id === body.id) {
      throw new BadRequestException('Please provide user id');
    }

    const [checkUserId, checkReport] = await Promise.all([
      await this.userRepository
        .createQueryBuilder('a_users')
        .where('a_users.id = :id', { id: reported_to })
        .getCount(),
      await this.reportedRepository
        .createQueryBuilder('a_user_reported')
        .where(
          'a_user_reported.reported_by = :reported_by AND a_user_reported.reported_to = :reported_to',
          { reported_by, reported_to },
        )
        .getCount(),
    ]);

    if (checkUserId === 0) {
      throw new NotFoundException('There is no user with this id');
    }

    if (checkReport !== 0) {
      return {
        status: 'success',
        message: 'You have already reported this user',
      };
    } else {
      try {
        await this.reportedRepository
          .createQueryBuilder('a_user_reported')
          .insert()
          .into(Reported)
          .values([{ reported_by, reported_to }])
          .execute();
      } catch (e) {
        throw new InternalServerErrorException(e.message);
      }

      this.adminNotificationsRepository.addReportNotification(
        user.name,
        reported_to,
      );

      this.adminNotificationService.sendNotificationsToAllAdmins(
        'New Report 🤔',
        `${user.name} has reported for another user, please check!`,
      );

      return {
        status: 'success',
        message: 'You have successfully reported this user',
      };
    }
  }

  async blockUser(user: User, body: ReportedDto): Promise<GlobalResponse> {
    const blocked_by: any = user.id;
    const blocked_to: any = body.id;

    if (!blocked_by || !blocked_to || user.id === body.id) {
      throw new BadRequestException('Please provide user id');
    }

    const [checkUserId, checkBlock] = await Promise.all([
      await this.userRepository
        .createQueryBuilder('a_users')
        .where('a_users.id = :id', { id: blocked_to })
        .getCount(),
      await this.blockedRepository
        .createQueryBuilder('a_user_blocked')
        .where(
          'a_user_blocked.blocked_by = :blocked_by AND a_user_blocked.blocked_to = :blocked_to',
          { blocked_by, blocked_to },
        )
        .getCount(),
    ]);

    if (checkUserId === 0) {
      throw new NotFoundException('There is no user with this id');
    }

    if (checkBlock !== 0) {
      return {
        status: 'success',
        message: 'You have already blocked this user',
      };
    } else {
      try {
        await this.blockedRepository
          .createQueryBuilder('a_user_blocked')
          .insert()
          .into(Blocked)
          .values([{ blocked_by, blocked_to }])
          .execute();
      } catch (e) {
        throw new InternalServerErrorException(e.message);
      }

      return {
        status: 'success',
        message: 'You have successfully blocked this user',
      };
    }
  }

  async flagUser(user: User, body: ReportedDto): Promise<GlobalResponse> {
    const flagged_by: any = user.id;
    const flagged_to: any = body.id;

    if (!flagged_by || !flagged_to || user.id === body.id) {
      throw new BadRequestException('Please provide user id');
    }

    const [checkUserId, checkFlag] = await Promise.all([
      await this.userRepository
        .createQueryBuilder('a_users')
        .where('a_users.id = :id', { id: flagged_to })
        .getCount(),
      await this.flaggedRepository
        .createQueryBuilder('a_user_flagged')
        .where(
          'a_user_flagged.flagged_by = :flagged_by AND a_user_flagged.flagged_to = :flagged_to',
          { flagged_by, flagged_to },
        )
        .getCount(),
    ]);

    if (checkUserId === 0) {
      throw new NotFoundException('There is no user with this id');
    }

    if (checkFlag !== 0) {
      return {
        status: 'success',
        message: 'You have already flagged this user',
      };
    } else {
      try {
        await this.flaggedRepository
          .createQueryBuilder('a_user_flagged')
          .insert()
          .into(Flagged)
          .values([{ flagged_by, flagged_to }])
          .execute();
      } catch (e) {
        throw new InternalServerErrorException(e.message);
      }

      this.adminNotificationsRepository.addFlagNotification(
        user.name,
        flagged_to,
      );

      this.adminNotificationService.sendNotificationsToAllAdmins(
        'New Flag ⛳️',
        `${user.name} has flagged for another user, please check!`,
      );

      return {
        status: 'success',
        message: 'You have successfully flagged this user',
      };
    }
  }

  async addPaidReport(
    user: User,
    body: AddPaidReportDto,
  ): Promise<GlobalResponse> {
    const id: any = user.id;
    const { birthday, birthday_1, birthday_2 } = body;

    if (!birthday && !birthday_1 && !birthday_2) {
      throw new BadRequestException('Please input birthdays');
    }

    if (birthday) {
      if (birthday.split(',')[0] !== 'February 29') {
        // Check birthday format
        if (!moment(birthday, 'll').isValid()) {
          throw new BadRequestException('Invalid birthday');
        }
      }

      // Check if birthday exist
      const checkUnlockedreport = await this.userUnlockedBirthdaysRepository
        .createQueryBuilder('a_user_unlocked_birthdays')
        .where(
          'a_user_unlocked_birthdays.user = :user AND a_user_unlocked_birthdays.date_name = :date_name',
          { user: id, date_name: birthday },
        )
        .getCount();

      if (checkUnlockedreport) {
        return {
          status: 'fail',
          message: 'Report already unlocked',
        };
      }

      try {
        await this.userUnlockedBirthdaysRepository
          .createQueryBuilder('a_user_unlocked_birthdays')
          .insert()
          .into(UserUnlockedBirthdays)
          .values([
            {
              user: id,
              date_name: birthday,
              type: UnlockedReportEnum.BOUGHT_REPORT,
            },
          ])
          .execute();

        return {
          status: 'success',
          message: 'Relationship report was successfully unlocked',
        };
      } catch (err) {
        throw new InternalServerErrorException(err.message);
      }
    } else if (birthday_1 && birthday_2) {
      if (birthday_1.split(',')[0] !== 'February 29') {
        // Check birthday format
        if (!moment(birthday_1, 'll').isValid()) {
          throw new BadRequestException('Invalid birthday 1');
        }
      }

      if (birthday_2.split(',')[0] !== 'February 29') {
        // Check birthday format
        if (!moment(birthday_2, 'll').isValid()) {
          throw new BadRequestException('Invalid birthday 2');
        }
      }

      const check = await this.userUnlockedRelationshipsRepository
        .createQueryBuilder('a_user_unlocked_relationships')
        .where(
          'a_user_unlocked_relationships.date_name_1 = :date_name_1 AND a_user_unlocked_relationships.date_name_2 = :date_name_2 AND a_user_unlocked_relationships.user = :user OR a_user_unlocked_relationships.date_name_1 = :date_name_2 AND a_user_unlocked_relationships.date_name_2 = :date_name_1 AND a_user_unlocked_relationships.user = :user',
          { user: id, date_name_1: birthday_1, date_name_2: birthday_2 },
        )
        .getCount();

      if (check) {
        return {
          status: 'fail',
          message: 'Report already unlocked',
        };
      }

      try {
        await this.userUnlockedRelationshipsRepository
          .createQueryBuilder('a_user_unlocked_relationships')
          .insert()
          .into(UserUnlockedRelationships)
          .values([
            {
              user: id,
              date_name_1: birthday_1,
              date_name_2: birthday_2,
              type: UnlockedReportEnum.BOUGHT_REPORT,
            },
          ])
          .execute();

        return {
          status: 'success',
          message: 'Relationship report was successfully unlocked',
        };
      } catch (err) {
        throw new InternalServerErrorException(err.message);
      }
    } else {
      throw new BadRequestException('Invalid birthday');
    }
  }

  async getDayReport(id: number) {
    if (!id || id < 0 || id === 0) {
      throw new BadRequestException('Please provide id');
    }

    const c_day = await this.dayRepository
      .createQueryBuilder('c_day')
      .where('c_day.id = :id', { id })
      .leftJoinAndSelect('c_day.famous', 'day_famous')
      .getOne();

    if (!c_day) {
      throw new NotFoundException(
        'There is no birthday report. Please change date.',
      );
    }

    c_day.famous = await async.map(c_day.famous, async (f: any) => {
      return {
        id: f.id,
        name: f.name,
        sln: f.sl_name,
        age: `born ${moment().diff(
          moment(
            `${String(f.birthdate).charAt(0)}${String(f.birthdate).charAt(
              1,
            )}${String(f.birthdate).charAt(2)}${String(f.birthdate).charAt(
              3,
            )}/${String(f.birthdate).charAt(4)}${String(f.birthdate).charAt(
              5,
            )}/${String(f.birthdate).charAt(6)}${String(f.birthdate).charAt(
              7,
            )}`,
            'YYYY/MM/DD',
          ).format('YYYY-MM-DD'),
          'years',
        )} years ago`,
        image: f.image,
      };
    });

    return {
      ...c_day,
      meditation: this.helperService.clearText(c_day.meditation),
      report: this.helperService.clearText(c_day.report),
      numbers: this.helperService.clearText(c_day.numbers),
      archetype: this.helperService.clearText(c_day.archetype),
      health: this.helperService.clearText(c_day.health),
      advice: this.helperService.clearText(c_day.advice),
    };
  }

  async getMonthReport(id: number) {
    if (!id || id < 0 || id === 0) {
      throw new BadRequestException('Please provide id');
    }

    const c_month = await this.monthRepository
      .createQueryBuilder('c_month')
      .where('c_month.id = :id', { id })
      .getOne();

    if (!c_month) {
      throw new NotFoundException(
        'There is no birthday report. Please change date.',
      );
    }

    return {
      ...c_month,
      report: this.helperService.clearText(c_month.report),
      personality: this.helperService.clearText(c_month.personality),
    };
  }

  async getPathReport(id: number) {
    if (!id || id < 0 || id === 0) {
      throw new BadRequestException('Please provide id');
    }

    const path_id = await this.pathRepository
      .createQueryBuilder('c_path')
      .where('c_path.id = :id', { id })
      .leftJoinAndSelect('c_path.way_id', 'way_id')
      .leftJoinAndSelect('c_path.week_id', 'week_id')
      .getOne();

    if (!path_id) {
      throw new NotFoundException('There is no path report. Please change id.');
    }

    return {
      id: path_id.id,
      prefix: path_id.way_id.prefix,
      way_name: path_id.way_id.name,
      name_long: path_id.week_id.name_long,
      name_medium: path_id.week_id.name_medium,
      image: path_id.image,
      challenge: this.helperService.clearText(path_id.challenge),
      fulfillment: this.helperService.clearText(path_id.fulfillment),
      report: this.helperService.clearText(path_id.report),
    };
  }

  async getSeasonReport(id: number) {
    if (!id || id < 0 || id === 0) {
      throw new BadRequestException('Please provide id');
    }

    const season_id = await this.seasonRepository
      .createQueryBuilder('c_season')
      .where('c_season.id = :id', { id })
      .getOne();

    if (!season_id) {
      throw new NotFoundException(
        'There is no season report. Please change id.',
      );
    }

    return {
      ...season_id,
      activity: this.helperService.clearText(season_id.activity),
      report: this.helperService.clearText(season_id.report),
    };
  }

  async getWayReport(id: number) {
    if (!id || id < 0 || id === 0) {
      throw new BadRequestException('Please provide id');
    }

    const way_id = await this.wayRepository
      .createQueryBuilder('c_way')
      .where('c_way.id = :id', { id })
      .leftJoinAndSelect('c_way.famous', 'famous')
      .getOne();

    if (!way_id) {
      throw new NotFoundException('There is no way report. Please change id.');
    }

    way_id.famous = await async.map(way_id.famous, async (f: any) => {
      return {
        id: f.id,
        name: f.name,
        sln: f.sl_name,
        age: `born ${moment().diff(
          moment(
            `${String(f.birthdate).charAt(0)}${String(f.birthdate).charAt(
              1,
            )}${String(f.birthdate).charAt(2)}${String(f.birthdate).charAt(
              3,
            )}/${String(f.birthdate).charAt(4)}${String(f.birthdate).charAt(
              5,
            )}/${String(f.birthdate).charAt(6)}${String(f.birthdate).charAt(
              7,
            )}`,
            'YYYY/MM/DD',
          ).format('YYYY-MM-DD'),
          'years',
        )} years ago`,
        image: f.image,
      };
    });

    return {
      id: way_id.id,
      name: way_id.name,
      image: way_id.image,
      week_from: way_id.week_from,
      week_to: way_id.week_to,
      s1: way_id.s1,
      s2: way_id.s2,
      s3: way_id.s3,
      w1: way_id.w1,
      w2: way_id.w2,
      w3: way_id.w3,
      report: this.helperService.clearText(way_id.report),
      suggestion: this.helperService.clearText(way_id.suggestion),
      lesson: this.helperService.clearText(way_id.core_lesson),
      goal: this.helperService.clearText(way_id.goal),
      release: this.helperService.clearText(way_id.must_release),
      reward: this.helperService.clearText(way_id.reward),
      balance: this.helperService.clearText(way_id.balance_point),
      famous: way_id.famous,
    };
  }

  async getWeekReport(id: number) {
    if (!id || id < 0 || id === 0) {
      throw new BadRequestException('Please provide id');
    }

    const week_id = await this.weekRepository
      .createQueryBuilder('c_week')
      .where('c_week.id = :id', { id })
      .leftJoinAndSelect('c_week.famous', 'famous')
      .getOne();

    if (!week_id) {
      throw new NotFoundException('There is no week report. Please change id.');
    }

    week_id.famous = await async.map(week_id.famous, async (f: any) => {
      return {
        id: f.id,
        name: f.name,
        sln: f.sl_name,
        age: `born ${moment().diff(
          moment(
            `${String(f.birthdate).charAt(0)}${String(f.birthdate).charAt(
              1,
            )}${String(f.birthdate).charAt(2)}${String(f.birthdate).charAt(
              3,
            )}/${String(f.birthdate).charAt(4)}${String(f.birthdate).charAt(
              5,
            )}/${String(f.birthdate).charAt(6)}${String(f.birthdate).charAt(
              7,
            )}`,
            'YYYY/MM/DD',
          ).format('YYYY-MM-DD'),
          'years',
        )} years ago`,
        image: f.image,
      };
    });

    return {
      ...week_id,
      report: this.helperService.clearText(week_id.report),
      advice: this.helperService.clearText(week_id.advice),
    };
  }
}
