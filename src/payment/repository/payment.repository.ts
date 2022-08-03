import { Payment } from '../entity/payment.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Payment)
export class PaymentRepository extends Repository<Payment> {
  async getPaymentsAmout() {
    const [reports, monthly] = await Promise.all([
      await this.createQueryBuilder('a_payments')
        .where('a_payments.item_name = :report', { report: 'Report' })
        .getCount(),
      await this.createQueryBuilder('a_payments')
        .where('a_payments.item_name = :monthly', { monthly: '(SLN) Monthly' })
        .getCount(),
    ]);

    const reportsAmount = reports * 0.99;
    const monthlyAmount = monthly * 9.99;

    return {
      reportsAmount: reportsAmount.toFixed(2),
      monthlyAmount: monthlyAmount.toFixed(2),
      amount: (reportsAmount + monthlyAmount).toFixed(2),
    };
  }
}
