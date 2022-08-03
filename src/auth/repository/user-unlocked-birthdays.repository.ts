import { UserUnlockedBirthdays } from './../entity/user-unlocked-birthdays.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(UserUnlockedBirthdays)
export class UserUnlockedBirthdaysRepository extends Repository<UserUnlockedBirthdays> {}
