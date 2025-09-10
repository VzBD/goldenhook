import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  private getTransporter() {
    if (this.transporter) return this.transporter;
    const service = process.env.EMAIL_SERVICE; // e.g., 'gmail'
    const host = process.env.EMAIL_SMTP_HOST;
    const port = process.env.EMAIL_SMTP_PORT ? parseInt(process.env.EMAIL_SMTP_PORT, 10) : undefined;
    const secure = process.env.EMAIL_SMTP_SECURE === 'true';
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;
    if (service) {
      this.transporter = nodemailer.createTransport({
        service,
        auth: { user, pass },
      });
    } else if (host && port) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: user && pass ? { user, pass } : undefined,
      });
    } else {
      // Not configured: keep null to no-op on send
      this.transporter = null;
      return null;
    }
    return this.transporter;
  }

  async sendMail(to: string, subject: string, html: string) {
    const from = process.env.EMAIL_FROM || process.env.EMAIL_USER || 'no-reply@example.com';
    const transporter = this.getTransporter();
    if (!transporter) {
      // eslint-disable-next-line no-console
      console.warn('[EmailService] Transport not configured. Skipping email to', to, subject);
      return;
    }
    await transporter.sendMail({ from, to, subject, html });
  }
}
