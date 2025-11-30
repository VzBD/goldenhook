import { Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';

@Injectable()
export class SmsService {
  private client = (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_ACCOUNT_SID.startsWith('AC'))
    ? new Twilio(process.env.TWILIO_ACCOUNT_SID as string, process.env.TWILIO_AUTH_TOKEN as string)
    : null;

  async sendSms(to: string, body: string) {
    if (!this.client) {
      // eslint-disable-next-line no-console
      console.warn('[SmsService] Twilio not configured. Skipping SMS to', to);
      return;
    }
    const from = process.env.TWILIO_FROM_NUMBER as string;
    if (!from) throw new Error('TWILIO_FROM_NUMBER is not configured');
    await this.client.messages.create({ to, from, body });
  }
}
