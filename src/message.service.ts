import { Injectable } from '@nestjs/common';
import * as config from 'config';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const messagebird = require('messagebird')(
  process.env.MESSAGE_BIRD_KEY || config.get('MESSAGE_BIRD').KEY,
);

@Injectable()
export class MessageService {
  async sendMessage(phoneNumber: string, body: string) {
    return new Promise(async (resolve, reject) => {
      const params = {
        originator: config.get('MESSAGE_BIRD').PHONE,
        recipients: [phoneNumber],
        body,
      };

      messagebird.messages.create(params, (err, response) => {
        if (err) reject(err);
        resolve(response);
      });
    });
  }
}
