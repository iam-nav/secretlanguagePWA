import { ApiProperty } from '@nestjs/swagger';
import { NotificationTypesEnum } from './enum/notificationTypes.enum';

export class Token {
  @ApiProperty()
  token: string;
}

export class GlobalResponse {
  @ApiProperty()
  status: string;

  @ApiProperty()
  message: string;
}

export class UsersImages {
  @ApiProperty()
  id: number;

  @ApiProperty()
  image: string;

  @ApiProperty()
  is_profile_pic: boolean;

  @ApiProperty()
  name: string;

  @ApiProperty()
  age: number;

  @ApiProperty()
  userId: number;
}

class NotificationUser {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  image: string;
}

export class GetNotifications {
  @ApiProperty()
  id: number;

  @ApiProperty({
    enum: [
      NotificationTypesEnum.ADD_IMAGE,
      NotificationTypesEnum.FLAG_USER,
      NotificationTypesEnum.REPORT_USER,
    ],
  })
  type: NotificationTypesEnum;

  @ApiProperty()
  message: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty({ type: NotificationUser })
  user: NotificationUser;

  @ApiProperty({
    type: UsersImages,
    nullable: true,
    description: 'Can be null',
  })
  image: UsersImages;
}

export class ManageUsers {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  age: number;

  @ApiProperty()
  image: string;

  @ApiProperty()
  friends: number;

  @ApiProperty()
  pending: number;

  @ApiProperty()
  requests: number;

  @ApiProperty()
  banned: boolean;
}

class Gender {
  @ApiProperty()
  id: number;

  @ApiProperty()
  gender_name: string;
}

class Interested_in {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;
}

export class UserProfile {
  @ApiProperty()
  id: number;

  @ApiProperty({ type: [UsersImages] })
  images: UsersImages[];

  @ApiProperty()
  name: string;

  @ApiProperty()
  date_name: string;

  @ApiProperty()
  phone_number: string;

  @ApiProperty()
  instagram: string;

  @ApiProperty()
  is_verified: boolean;

  @ApiProperty()
  vip: boolean;

  @ApiProperty({ type: Gender })
  gender: Gender;

  @ApiProperty()
  gender_preference: number;

  @ApiProperty({ type: Interested_in })
  interested_in: Interested_in;

  @ApiProperty()
  address: string;

  @ApiProperty()
  attractive: boolean;
}

export class SearchUsers {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  age: number;

  @ApiProperty()
  image: string;
}

export class GetMe {
  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  image: string;

  @ApiProperty()
  usersCount: number;

  @ApiProperty()
  womanCount: number;

  @ApiProperty()
  manCount: number;

  @ApiProperty()
  reportsAmount: string;

  @ApiProperty()
  monthlyAmount: string;

  @ApiProperty()
  amount: string;

  @ApiProperty()
  bannedUsersCount: number;

  @ApiProperty()
  reportedUsersCount: number;
}

export class UserResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  date_name: string;

  @ApiProperty()
  image: string;
}
