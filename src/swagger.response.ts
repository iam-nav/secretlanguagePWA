import { ApiProperty } from '@nestjs/swagger';

export class Global {
  @ApiProperty()
  status: string;

  @ApiProperty()
  message: string;
}

export class Token {
  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  token: string;
}

export class GendersSW {
  @ApiProperty()
  id: number;

  @ApiProperty()
  gender_name: string;
}

export class InterestsSW {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;
}

export class GetSettingsSW {
  @ApiProperty()
  name: string;

  @ApiProperty({ type: GendersSW })
  gender: GendersSW;

  @ApiProperty()
  country_name: string;

  @ApiProperty()
  date_name: string;

  @ApiProperty()
  instagram: string;

  @ApiProperty()
  gender_preference: number;

  @ApiProperty({ type: InterestsSW })
  interested_in: InterestsSW;

  @ApiProperty()
  canEditLocation: boolean;
}

export class IdealForTags {
  @ApiProperty()
  name: string;
}

export class SearchUsersSW {
  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  age: number;

  @ApiProperty()
  user_birthday: string;

  @ApiProperty()
  user_birthday_name: string;

  @ApiProperty()
  sln: string;

  @ApiProperty()
  sln_description: string;

  @ApiProperty()
  image: string;

  @ApiProperty()
  rel_image: string;

  @ApiProperty()
  my_birthday: string;

  @ApiProperty()
  my_birthday_name: string;

  @ApiProperty()
  ideal_for: string;

  @ApiProperty()
  report: string;

  @ApiProperty()
  advice: string;

  @ApiProperty()
  famous_years: string;

  @ApiProperty()
  distance: string;
}

export class SearchAllUsersSW {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  age: number;

  @ApiProperty()
  image: string;

  @ApiProperty()
  ideal: string;

  @ApiProperty()
  friendStatus: number;

  @ApiProperty()
  distance: string;
}

export class FriendsRequestsCounts {
  @ApiProperty()
  friends: number;

  @ApiProperty()
  pending: number;

  @ApiProperty()
  requests: number;
}

export class Friends {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  image: string;

  @ApiProperty()
  ideal: string;
}

export class Report {
  @ApiProperty()
  id: number;
}

export class Me {
  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  device_token: string;

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

  @ApiProperty({ type: [Report] })
  reports: [];
}

export class UserProfile {
  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  age: number;

  @ApiProperty()
  user_birthday: string;

  @ApiProperty()
  user_birthday_name: string;

  @ApiProperty()
  sln: string;

  @ApiProperty()
  sln_description: string;

  @ApiProperty()
  image: string;

  @ApiProperty()
  rel_image: string;

  @ApiProperty()
  my_birthday: string;

  @ApiProperty()
  my_birthday_name: string;

  @ApiProperty()
  ideal_for: string;

  @ApiProperty()
  report: string;

  @ApiProperty()
  advice: string;

  @ApiProperty()
  famous_years: string;

  @ApiProperty()
  distance: string;

  @ApiProperty()
  friendStatus: number;

  @ApiProperty({ nullable: true })
  chatId: number;
}

export class SharedUser {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  age: number;

  @ApiProperty()
  user_birthday: string;

  @ApiProperty()
  user_birthday_name: string;

  @ApiProperty()
  sln: string;

  @ApiProperty()
  sln_description: string;

  @ApiProperty()
  image: string;

  @ApiProperty()
  report: string;

  @ApiProperty()
  numbers: string;

  @ApiProperty()
  archetype: string;

  @ApiProperty()
  health: string;

  @ApiProperty()
  advice: string;

  @ApiProperty()
  famous_years: string;

  @ApiProperty()
  distance: string;
}

export class Famous {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  sln: string;

  @ApiProperty()
  age: string;

  @ApiProperty()
  image: string;
}

export class Way_Report {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  image: string;

  @ApiProperty()
  week_from: string;

  @ApiProperty()
  week_to: string;

  @ApiProperty()
  s1: string;

  @ApiProperty()
  s2: string;

  @ApiProperty()
  s3: string;

  @ApiProperty()
  w1: string;

  @ApiProperty()
  w2: string;

  @ApiProperty()
  w3: string;

  @ApiProperty()
  report: string;

  @ApiProperty()
  suggestion: string;

  @ApiProperty()
  lesson: string;

  @ApiProperty()
  goal: string;

  @ApiProperty()
  release: string;

  @ApiProperty()
  reward: string;

  @ApiProperty()
  balance: string;

  @ApiProperty({ type: [Famous] })
  famous: [Famous];
}

export class Path_Report {
  @ApiProperty()
  id: number;

  @ApiProperty()
  prefix: string;

  @ApiProperty()
  way_name: string;

  @ApiProperty()
  name_long: string;

  @ApiProperty()
  name_medium: string;

  @ApiProperty()
  image: string;

  @ApiProperty()
  challenge: string;

  @ApiProperty()
  fulfillment: string;

  @ApiProperty()
  report: string;
}

export class Relationship_Report {
  @ApiProperty()
  id: number;

  @ApiProperty()
  birthday_1: string;

  @ApiProperty()
  birthday_1_name: string;

  @ApiProperty()
  birthday_2: string;

  @ApiProperty()
  birthday_2_name: string;

  @ApiProperty()
  image: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  s1: string;

  @ApiProperty()
  s2: string;

  @ApiProperty()
  s3: string;

  @ApiProperty()
  w1: string;

  @ApiProperty()
  w2: string;

  @ApiProperty()
  w3: string;

  @ApiProperty()
  ideal_for: string;

  @ApiProperty()
  problematic_for: string;

  @ApiProperty()
  report: string;

  @ApiProperty()
  advice: string;

  @ApiProperty()
  shareId: number;
}

export class Season_Report {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  span1: string;

  @ApiProperty()
  span1_short: string;

  @ApiProperty()
  span2: string;

  @ApiProperty()
  span2_short: string;

  @ApiProperty()
  season_name: string;

  @ApiProperty()
  activity: string;

  @ApiProperty()
  report: string;

  @ApiProperty()
  faculty: string;

  @ApiProperty()
  image: string;
}

export class Month_Report {
  @ApiProperty()
  id: number;

  @ApiProperty()
  start_day: number;

  @ApiProperty()
  start_month: number;

  @ApiProperty()
  span1: string;

  @ApiProperty()
  span1_short: string;

  @ApiProperty()
  span2: string;

  @ApiProperty()
  span2_short: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  name_plural: string;

  @ApiProperty()
  sign: string;

  @ApiProperty()
  season: string;

  @ApiProperty()
  mode: string;

  @ApiProperty()
  motto: string;

  @ApiProperty()
  report: string;

  @ApiProperty()
  personality: string;

  @ApiProperty()
  image: string;
}

export class Week_Report {
  @ApiProperty()
  id: number;

  @ApiProperty()
  date_span: string;

  @ApiProperty()
  start_month: number;

  @ApiProperty()
  start_day: number;

  @ApiProperty()
  length_week: number;

  @ApiProperty()
  name_long: string;

  @ApiProperty()
  name_medium: string;

  @ApiProperty()
  name_short: string;

  @ApiProperty()
  report: string;

  @ApiProperty()
  advice: string;

  @ApiProperty()
  s1: string;

  @ApiProperty()
  s2: string;

  @ApiProperty()
  s3: string;

  @ApiProperty()
  w1: string;

  @ApiProperty()
  w2: string;

  @ApiProperty()
  w3: string;

  @ApiProperty({ type: [Famous] })
  famous: [Famous];

  @ApiProperty()
  image: string;
}

export class Day_Report {
  @ApiProperty()
  id: number;

  @ApiProperty()
  day: number;

  @ApiProperty()
  month: number;

  @ApiProperty()
  date_name: string;

  @ApiProperty()
  day_name: string;

  @ApiProperty()
  day_name_short: string;

  @ApiProperty()
  s1: string;

  @ApiProperty()
  s2: string;

  @ApiProperty()
  s3: string;

  @ApiProperty()
  w1: string;

  @ApiProperty()
  w2: string;

  @ApiProperty()
  w3: string;

  @ApiProperty()
  meditation: string;

  @ApiProperty()
  report: string;

  @ApiProperty()
  numbers: string;

  @ApiProperty()
  archetype: string;

  @ApiProperty()
  health: string;

  @ApiProperty()
  advice: string;

  @ApiProperty({ type: [Famous] })
  famous: [Famous];

  @ApiProperty()
  image: string;
}

export class BirthdayReport {
  @ApiProperty()
  id: number;

  @ApiProperty()
  date_name: string;

  @ApiProperty()
  sln: string;

  @ApiProperty()
  sln_description: string;

  @ApiProperty()
  famous_years: string;

  @ApiProperty()
  shareId: number;

  @ApiProperty({ type: Day_Report })
  day_report: Day_Report;

  @ApiProperty({ type: Week_Report })
  week_report: Week_Report;

  @ApiProperty({ type: Month_Report })
  month_report: Month_Report;

  @ApiProperty({ type: Season_Report })
  season_report: Season_Report;

  @ApiProperty({ type: Way_Report })
  way_report: Way_Report;

  @ApiProperty({ type: Path_Report })
  path_report: Path_Report;

  @ApiProperty({ type: Relationship_Report })
  relationship_report: Relationship_Report;
}

// Chats
class MessageContent {
  @ApiProperty()
  type: string;

  @ApiProperty()
  message: string;
}

class LatestMessage {
  @ApiProperty()
  id: number;

  @ApiProperty({ type: [MessageContent] })
  content: MessageContent[];

  @ApiProperty()
  type: string;

  @ApiProperty()
  created_at: string;
}

export class ChatUser {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  image: string;

  @ApiProperty()
  age: number;

  @ApiProperty()
  ideal_for: string;
}

export class ChatsSW {
  @ApiProperty()
  id: number;

  @ApiProperty()
  chatName: string;

  @ApiProperty()
  image: string;

  @ApiProperty({ type: LatestMessage })
  message: LatestMessage;

  @ApiProperty({ type: ChatUser })
  user: ChatUser;

  @ApiProperty()
  read: boolean;

  @ApiProperty()
  unread_messages_count: string;
}

export class ChatMessagesUserSW {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  image: string;
}
export class ChatMessagesSW {
  @ApiProperty()
  id: number;

  @ApiProperty({ type: [MessageContent] })
  content: MessageContent[];

  @ApiProperty()
  type: string;

  @ApiProperty({ type: ChatMessagesUserSW })
  user: ChatMessagesUserSW;

  @ApiProperty()
  read: boolean;

  @ApiProperty()
  created_at: string;
}

export class CitiesResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  country: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  lat: string;

  @ApiProperty()
  lng: string;
}
