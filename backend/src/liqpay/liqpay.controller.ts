import { Controller, Post, Body } from '@nestjs/common';
import { LiqPayService } from './liqpay.service';

@Controller('liqpay')
export class LiqPayController {
  constructor(private readonly liqpayService: LiqPayService) {}

  @Post('pay')
  async createPayment(@Body('amount') amount: number, @Body('currency') currency: string, @Body('description') description: string, @Body('orderId') orderId: string) {
    return this.liqpayService.createPaymentData(amount, currency, description, orderId);
  }
}
