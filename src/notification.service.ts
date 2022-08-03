import { Injectable } from '@nestjs/common';
import * as PushNotifications from 'node-pushnotifications';
import * as fcmNode from 'fcm-node';

@Injectable()
export class NotificationService {
  settings: any;

  constructor() {
    this.settings = {
      apn: {
        token: {
          key: `src/AuthKey_B5ZN3CK4PB.p8`,
          keyId: process.env.APPLE_NOTIFICATION_KEY_ID || '',
          teamId: process.env.APPLE_NOTIFICATION_TEAM_ID || '',
        },
        production: true,
      },
    };
  }

  async sendNotification(
    title: string,
    body: string,
    device_token: string,
    action?: string,
  ) {
    if (!device_token) return;
    const push = new PushNotifications(this.settings);

    let data: any = {
      topic: process.env.APPLE_NOTIFICATION_BUNDLE_ID || '',
      sound: 'ping.aiff',
      alert: {
        title: title || '',
        body: body || '',
      },
      contentAvailable: 1,
      pushType: 'alert',
      expiry: Math.floor(Date.now() / 1000) + 28 * 86400,
    };

    if (action) data = { ...data, alert: { ...data.alert, action } };

    push.send(device_token, data, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
        console.log('Sent to device:', result && result[0].message[0].regId);
      }
    });
  }

  async sendFCMNotification(token: string, body: string) {
    const serverKey = process.env.FCM_KEY;
    const fcmObj = new fcmNode(serverKey);

    const message = {
      to: token,
      priority: 'high',
      notification: {
        body,
        sound: 'ping.aiff',
      },
    };

    fcmObj.send(message, function (err, response) {
      if (err) {
        console.log(err);
      } else {
        console.log(response);
      }
    });
  }
}
