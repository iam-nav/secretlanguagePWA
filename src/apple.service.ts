import { Injectable } from '@nestjs/common';
import * as config from 'config';
import axios from 'axios';

@Injectable()
export class AppleService {
  async verifyReceiptSandbox(receipt: string, excludeOldTransaction: boolean) {
    return new Promise((resolve, reject) => {
      const url = config.get('APPLE_PAY').SANDBOX_URL;
      let body: any = {
        'receipt-data': receipt,
        password: process.env.APPLE_PASSWORD,
      };

      if (excludeOldTransaction) {
        body = { ...body, 'exclude-old-transactions': excludeOldTransaction };
      }

      axios
        .post(url, body)
        .then((response) => {
          resolve(response.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  async verifyReceiptLive(receipt: string, excludeOldTransaction: boolean) {
    return new Promise((resolve, reject) => {
      const url = config.get('APPLE_PAY').LIVE_URL;
      let body: any = {
        'receipt-data': receipt,
        password: process.env.APPLE_PASSWORD,
      };

      if (excludeOldTransaction) {
        body = { ...body, 'exclude-old-transactions': excludeOldTransaction };
      }

      axios
        .post(url, body)
        .then((response) => {
          resolve(response.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  getErrorByCode(code: number) {
    if (code == 21000) {
      return 'The request to the App Store was not made using the HTTP POST request method.';
    } else if (code == 21001) {
      return 'This status code is no longer sent by the App Store.';
    } else if (code == 21002) {
      return 'The data in the receipt-data property was malformed or the service experienced a temporary issue. Try again.';
    } else if (code == 21003) {
      return 'The receipt could not be authenticated.';
    } else if (code == 21004) {
      return 'The shared secret you provided does not match the shared secret on file for your account.';
    } else if (code == 21005) {
      return 'The receipt server was temporarily unable to provide the receipt. Try again.';
    } else if (code == 21006) {
      return 'This receipt is valid but the subscription has expired. When this status code is returned to your server, the receipt data is also decoded and returned as part of the response. Only returned for iOS 6-style transaction receipts for auto-renewable subscriptions.';
    } else if (code == 21007) {
      return 'This receipt is from the test environment, but it was sent to the production environment for verification.';
    } else if (code == 21008) {
      return 'This receipt is from the production environment, but it was sent to the test environment for verification.';
    } else if (code == 21009) {
      return 'Internal data access error. Try again later.';
    } else if (code == 21010) {
      return 'The user account cannot be found or has been deleted.';
    } else {
      return 'Unknown error';
    }
  }
}
