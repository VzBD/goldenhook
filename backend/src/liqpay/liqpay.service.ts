import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class LiqPayService {
  private publicKey = process.env.LIQPAY_PUBLIC_KEY;
  private privateKey = process.env.LIQPAY_PRIVATE_KEY;

  createPaymentData(amount: number, currency: string, description: string, orderId: string): { data: string, signature: string } {
    const data = {
      public_key: this.publicKey,
      version: '3',
      action: 'pay',
      amount,
      currency,
      description,
      order_id: orderId,
      sandbox: '1', // Уберите для продакшн
    };
    const dataStr = Buffer.from(JSON.stringify(data)).toString('base64');
    const signature = crypto.createHash('sha1').update(this.privateKey + dataStr + this.privateKey).digest('base64');
    return { data: dataStr, signature };
  }
}
