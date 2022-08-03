import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GlobalResponse } from '../auth/interfaces/global-response.interface';
import { User } from '../auth/entity/user.entity';
import { VerifyReceiptDto } from './dto/verifyReceipt.dto';
import { PaymentRepository } from './repository/payment.repository';
import { AppleService } from '../apple.service';
import { Payment } from './entity/payment.entity';
import { AddPaidReportDto } from './dto/addPaidReport.dto';
import * as moment from 'moment';
import { UserUnlockedBirthdaysRepository } from '../auth/repository/user-unlocked-birthdays.repository';
import { UserUnlockedRelationshipsRepository } from '../auth/repository/user-unlocked-relationships.repository';
import { UserUnlockedBirthdays } from '../auth/entity/user-unlocked-birthdays.entity';
import { UnlockedReportEnum } from '../auth/enum/unlocked-reports.enum';
import { UserUnlockedRelationships } from '../auth/entity/user-unlocked-relationships.entity';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(PaymentRepository)
    private paymentRepository: PaymentRepository,
    @InjectRepository(UserUnlockedBirthdaysRepository)
    private userUnlockedBirthdaysRepository: UserUnlockedBirthdaysRepository,
    @InjectRepository(UserUnlockedRelationshipsRepository)
    private userUnlockedRelationshipsRepository: UserUnlockedRelationshipsRepository,
    private appleService: AppleService,
  ) {}

  async verifyReceipt(
    user: User,
    body: VerifyReceiptDto,
  ): Promise<GlobalResponse> {
    const { receipt } = body;

    try {
      const verifyLiveResponse: any = await this.appleService.verifyReceiptLive(
        receipt,
        true,
      );

      if (verifyLiveResponse.status === 21007) {
        // Sandbox
        try {
          const verifySandboxResponse: any =
            await this.appleService.verifyReceiptSandbox(receipt, true);
          if (verifySandboxResponse.status == 0) {
            let isExpired = true;
            let latestReceipt: any;
            if (verifySandboxResponse.latest_receipt_info.length > 0) {
              latestReceipt = verifySandboxResponse.latest_receipt_info[0];
              const currentMilliseconds = new Date().getTime();
              if (
                currentMilliseconds < parseInt(latestReceipt.expires_date_ms)
              ) {
                isExpired = false;
              }
            }

            const payment = await this.paymentRepository
              .createQueryBuilder('a_payments')
              .where(
                'a_payments.txn_type = :txn_type AND a_payments.user = :id',
                { txn_type: 'subscr_signup', id: user.id },
              )
              .getOne();

            if (!payment) {
              await this.paymentRepository
                .createQueryBuilder('a_payments')
                .insert()
                .into(Payment)
                .values([
                  {
                    user: () => `${user.id}`,
                    purchase_date: latestReceipt.purchase_date,
                    transaction_id: latestReceipt.transaction_id,
                    transaction: JSON.stringify(latestReceipt),
                    receipt,
                  },
                ])
                .execute();
            } else {
              payment.purchase_date = latestReceipt.purchase_date;
              payment.receipt = verifySandboxResponse.latest_receipt;
              payment.transaction = JSON.stringify(
                verifySandboxResponse.latest_receipt_info[0],
              );
              payment.transaction_id =
                verifySandboxResponse.latest_receipt_info[0].transaction_id;
              await payment.save();
            }

            user.user_type = 1;
            if (!isExpired) {
              user.user_type = 2;
            }
            await user.save();

            return {
              status: 'success',
              message: 'Your sandbox payment was successfully verified',
            };
          } else {
            const errorMessage = this.appleService.getErrorByCode(
              verifySandboxResponse.status,
            );

            throw new BadRequestException(errorMessage);
          }
        } catch (err) {
          throw new InternalServerErrorException(err.message);
        }
      } else if (verifyLiveResponse.status === 0) {
        let isExpired = true;
        let latestReceipt: any;
        if (verifyLiveResponse.latest_receipt_info.length > 0) {
          latestReceipt = verifyLiveResponse.latest_receipt_info[0];
          const currentMilliseconds = new Date().getTime();
          if (currentMilliseconds < parseInt(latestReceipt.expires_date_ms)) {
            isExpired = false;
          }
        }

        const payment = await this.paymentRepository
          .createQueryBuilder('a_payments')
          .where('a_payments.txn_type = :txn_type AND a_payments.user = :id', {
            txn_type: 'subscr_signup',
            id: user.id,
          })
          .getOne();

        if (!payment) {
          await this.paymentRepository
            .createQueryBuilder('a_payments')
            .insert()
            .into(Payment)
            .values([
              {
                user: () => `${user.id}`,
                purchase_date: latestReceipt.purchase_date,
                transaction_id: latestReceipt.transaction_id,
                transaction: JSON.stringify(latestReceipt),
                receipt,
              },
            ])
            .execute();
        } else {
          payment.purchase_date = latestReceipt.purchase_date;
          payment.receipt = verifyLiveResponse.latest_receipt;
          payment.transaction = JSON.stringify(
            verifyLiveResponse.latest_receipt_info[0],
          );
          payment.transaction_id =
            verifyLiveResponse.latest_receipt_info[0].transaction_id;
          await payment.save();
        }

        user.user_type = 1;
        if (!isExpired) {
          user.user_type = 2;
        }
        await user.save();

        return {
          status: 'success',
          message: 'Your live payment was successfully verified',
        };
      } else {
        const errorMessage = this.appleService.getErrorByCode(
          verifyLiveResponse.status,
        );

        throw new BadRequestException(errorMessage);
      }
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async addPaidReport(
    user: User,
    body: AddPaidReportDto,
  ): Promise<GlobalResponse> {
    const id: any = user.id;
    const { birthday, birthday_1, birthday_2, receipt } = body;

    if (!birthday && !birthday_1 && !birthday_2) {
      throw new BadRequestException('Please input birthdays');
    }

    if (birthday && receipt) {
      if (birthday !== 'February 29') {
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
        const verified = await this.verifyBuyedReportReceipt(user, { receipt });

        if (verified) {
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
        } else {
          throw new NotFoundException('Something went wrong. Please try again');
        }
      } catch (err) {
        throw new BadRequestException(err.message);
      }
    } else if (birthday_1 && birthday_2 && receipt) {
      if (birthday_1 !== 'February 29') {
        // Check birthday format
        if (!moment(birthday_1, 'll').isValid()) {
          throw new BadRequestException('Invalid birthday 1');
        }
      }

      if (birthday_2 !== 'February 29') {
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
        const verified = await this.verifyBuyedReportReceipt(user, { receipt });

        if (verified) {
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
        } else {
          throw new NotFoundException('Please complete payment and try again');
        }
      } catch (err) {
        throw new InternalServerErrorException(err.message);
      }
    } else {
      throw new BadRequestException('Invalid birthday');
    }
  }

  async verifyBuyedReportReceipt(
    user: User,
    body: VerifyReceiptDto,
  ): Promise<boolean> {
    const { receipt } = body;
    try {
      const verifyLiveResponse: any = await this.appleService.verifyReceiptLive(
        receipt,
        false,
      );

      if (verifyLiveResponse.status === 21007) {
        // Sandbox
        try {
          const verifySandboxResponse: any =
            await this.appleService.verifyReceiptSandbox(receipt, false);
          if (verifySandboxResponse.status == 0) {
            let latestReceipt: any;
            if (verifySandboxResponse.receipt)
              latestReceipt = verifySandboxResponse.receipt.in_app.filter(
                (a: any) => a.product_id === 'com.read.report',
              )[0];

            if (!latestReceipt) {
              return false;
            }

            const payment = await this.paymentRepository
              .createQueryBuilder('a_payments')
              .where(
                'a_payments.txn_type = :txn_type AND a_payments.user = :id AND a_payments.transaction_id = :transaction_id',
                {
                  txn_type: 'buy_report',
                  transaction_id: latestReceipt.transaction_id,
                  id: user.id,
                },
              )
              .getOne();

            if (!payment) {
              // Check if payment has
              await this.paymentRepository
                .createQueryBuilder('a_payments')
                .insert()
                .into(Payment)
                .values([
                  {
                    item_name: 'Report',
                    txn_type: 'buy_report',
                    period: 'none',
                    gross_amount: '0.99',
                    user: () => `${user.id}`,
                    purchase_date: latestReceipt.purchase_date,
                    transaction_id: latestReceipt.transaction_id,
                    transaction: JSON.stringify(latestReceipt),
                    receipt,
                  },
                ])
                .execute();
            }

            return true;
          } else {
            const errorMessage = this.appleService.getErrorByCode(
              verifySandboxResponse.status,
            );

            throw new BadRequestException(errorMessage);
          }
        } catch (err) {
          throw new InternalServerErrorException(err.message);
        }
      } else if (verifyLiveResponse.status === 0) {
        let latestReceipt: any;
        if (verifyLiveResponse.receipt)
          latestReceipt = verifyLiveResponse.receipt.in_app.filter(
            (a: any) => a.product_id === 'com.read.report',
          )[0];

        const payment = await this.paymentRepository
          .createQueryBuilder('a_payments')
          .where(
            'a_payments.txn_type = :txn_type AND a_payments.user = :id AND a_payments.transaction_id = :transaction_id',
            {
              txn_type: 'buy_report',
              transaction_id: latestReceipt.transaction_id,
              id: user.id,
            },
          )
          .getOne();

        if (!payment) {
          // Check if payment has
          await this.paymentRepository
            .createQueryBuilder('a_payments')
            .insert()
            .into(Payment)
            .values([
              {
                item_name: 'Report',
                txn_type: 'buy_report',
                period: 'none',
                gross_amount: '0.99',
                user: () => `${user.id}`,
                purchase_date: latestReceipt.purchase_date,
                transaction_id: latestReceipt.transaction_id,
                transaction: JSON.stringify(latestReceipt),
                receipt,
              },
            ])
            .execute();
        }

        return true;
      } else {
        const errorMessage = this.appleService.getErrorByCode(
          verifyLiveResponse.status,
        );

        throw new BadRequestException(errorMessage);
      }
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async verifyUserSubscriptionStatus(user: User): Promise<GlobalResponse> {
    const { id } = user;

    if (user.vip_by_admin) {
      user.user_type = 2;
      await user.save();

      return {
        status: 'success',
        message: 'Vip by admin',
      };
    }

    if (user.is_old_user) {
      user.user_type = 2;
      await user.save();

      return {
        status: 'success',
        message: 'Verified old user',
      };
    }

    if (user.is_imported_user && user.user_type === 2) {
      user.user_type = 2;
      await user.save();

      return {
        status: 'success',
        message: 'Verified imported user',
      };
    }

    const payment = await this.paymentRepository
      .createQueryBuilder('a_payments')
      .select('a_payments.receipt')
      .where('a_payments.user = :id', { id })
      .andWhere('a_payments.txn_type = :txn_type', {
        txn_type: 'subscr_signup',
      })
      .getOne();

    if (!payment) {
      user.user_type = 1;
      await user.save();

      return {
        status: 'success',
        message: 'Verified',
      };
    }

    const { receipt } = payment;

    try {
      const verifyLiveResponse: any = await this.appleService.verifyReceiptLive(
        receipt,
        true,
      );

      if (verifyLiveResponse.status === 21007) {
        // Sandbox
        try {
          const verifySandboxResponse: any =
            await this.appleService.verifyReceiptSandbox(receipt, true);
          if (verifySandboxResponse.status == 0) {
            let isExpired = true;
            let latestReceipt: any;
            if (verifySandboxResponse.latest_receipt_info.length > 0) {
              latestReceipt = verifySandboxResponse.latest_receipt_info[0];
              const currentMilliseconds = new Date().getTime();
              if (
                currentMilliseconds < parseInt(latestReceipt.expires_date_ms)
              ) {
                isExpired = false;
              }
            }

            user.user_type = 1;
            if (!isExpired) {
              user.user_type = 2;
            }
            await user.save();

            return {
              status: 'success',
              message: 'Verified',
            };
          } else {
            const errorMessage = this.appleService.getErrorByCode(
              verifySandboxResponse.status,
            );

            user.user_type = 1;
            await user.save();

            return {
              status: 'success',
              message: errorMessage,
            };
          }
        } catch (err) {
          user.user_type = 1;
          await user.save();

          return {
            status: 'success',
            message: err.message,
          };
        }
      } else if (verifyLiveResponse.status === 0) {
        let isExpired = true;
        let latestReceipt: any;
        if (verifyLiveResponse.latest_receipt_info.length > 0) {
          latestReceipt = verifyLiveResponse.latest_receipt_info[0];
          const currentMilliseconds = new Date().getTime();
          if (currentMilliseconds < parseInt(latestReceipt.expires_date_ms)) {
            isExpired = false;
          }
        }

        user.user_type = 1;
        if (!isExpired) {
          user.user_type = 2;
        }
        await user.save();

        return {
          status: 'success',
          message: 'Verified',
        };
      } else {
        const errorMessage = this.appleService.getErrorByCode(
          verifyLiveResponse.status,
        );

        user.user_type = 1;
        await user.save();

        return {
          status: 'success',
          message: errorMessage,
        };
      }
    } catch (err) {
      user.user_type = 1;
      await user.save();

      return {
        status: 'success',
        message: err.message,
      };
    }
  }
}
