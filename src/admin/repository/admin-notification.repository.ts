import { AdminNotifications } from '../entity/admin-notification.entity';
import { EntityRepository, Repository } from 'typeorm';
import { NotificationTypesEnum } from '../enum/notificationTypes.enum';

@EntityRepository(AdminNotifications)
export class AdminNotificationsRepository extends Repository<AdminNotifications> {
  addImageNotification(userId: number, imageId: number) {
    this.createQueryBuilder('a_admin_notifications')
      .insert()
      .into(AdminNotifications)
      .values([
        {
          type: NotificationTypesEnum.ADD_IMAGE,
          message: 'added a new photo',
          user: () => `${userId}`,
          image: () => `${imageId}`,
        },
      ])
      .execute();
  }

  addReportNotification(name: string, reported_to: number) {
    this.createQueryBuilder('a_admin_notifications')
      .insert()
      .into(AdminNotifications)
      .values([
        {
          type: NotificationTypesEnum.REPORT_USER,
          message: `${name} reported`,
          user: () => `${reported_to}`,
        },
      ])
      .execute();
  }

  addFlagNotification(name: string, flagged_to: number) {
    this.createQueryBuilder('a_admin_notifications')
      .insert()
      .into(AdminNotifications)
      .values([
        {
          type: NotificationTypesEnum.FLAG_USER,
          message: `${name} flagged`,
          user: () => `${flagged_to}`,
        },
      ])
      .execute();
  }
}
