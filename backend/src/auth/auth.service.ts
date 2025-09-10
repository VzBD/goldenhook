import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import * as bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { EmailService } from '../common/email.service';
import { SmsService } from '../common/sms.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  private emailService: EmailService,
  private smsService: SmsService,
  ) {}

  async register(email: string, password: string, phone?: string): Promise<User> {
    const hash = await bcrypt.hash(password, 10);
    const activationToken = randomBytes(32).toString('hex');
    const user = this.userRepository.create({
      email,
      password: hash,
      phone,
      activationToken,
      activationExpiresAt: new Date(Date.now() + 1000 * 60 * 60), // 1h
      isActive: false,
    });
    const saved = await this.userRepository.save(user);
    await this.sendActivation(saved);
    return saved;
  }

  private async sendActivation(user: User) {
    const frontend = process.env.FRONTEND_URL || 'http://localhost:3000';
    if (user.activationToken) {
      const link = `${frontend}/activate?token=${user.activationToken}`;
      await this.emailService.sendMail(
        user.email,
        'Подтвердите email',
        `<p>Здравствуйте!</p><p>Для активации аккаунта перейдите по ссылке:</p><p><a href="${link}">${link}</a></p>`,
      );
    }
    if (user.phone) {
      const code = String(Math.floor(100000 + Math.random() * 900000));
      user.phoneVerificationCode = code;
      user.phoneCodeExpiresAt = new Date(Date.now() + 1000 * 60 * 10); // 10m
      await this.userRepository.save(user);
      await this.smsService.sendSms(user.phone, `Код подтверждения: ${code}`);
    }
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }

  async findOrCreateGoogleUser(email: string, displayName: string): Promise<User> {
    let user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      user = this.userRepository.create({ email, password: '', role: 'user', isActive: true });
      await this.userRepository.save(user);
    }
    return user;
  }

  async getById(id: number): Promise<User | null> {
    const u = await this.userRepository.findOne({ where: { id } });
    return u ?? null;
  }

  async activateByEmailToken(token: string) {
    const user = await this.userRepository.findOne({ where: { activationToken: token } });
    if (!user) return { ok: false, error: 'Invalid token' };
    if (user.activationExpiresAt && user.activationExpiresAt.getTime() < Date.now()) {
      return { ok: false, error: 'Token expired' };
    }
    user.isActive = true;
    user.activationToken = null as any;
    user.activationExpiresAt = null;
    await this.userRepository.save(user);
    return { ok: true };
  }

  async activateByPhoneCode(phone: string, code: string) {
    const user = await this.userRepository.findOne({ where: { phone } });
    if (!user) return { ok: false, error: 'User not found' };
    if (!user.phoneVerificationCode || user.phoneVerificationCode !== code) return { ok: false, error: 'Invalid code' };
    if (user.phoneCodeExpiresAt && user.phoneCodeExpiresAt.getTime() < Date.now()) return { ok: false, error: 'Code expired' };
    user.isActive = true;
    user.phoneVerificationCode = null;
    user.phoneCodeExpiresAt = null;
    await this.userRepository.save(user);
    return { ok: true };
  }

  async requestPasswordReset(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) return { ok: true }; // не раскрываем, есть ли email
    user.passwordResetToken = randomBytes(32).toString('hex');
    user.passwordResetExpiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1h
    await this.userRepository.save(user);
    const frontend = process.env.FRONTEND_URL || 'http://localhost:3000';
    const link = `${frontend}/reset-password?token=${user.passwordResetToken}`;
    await this.emailService.sendMail(
      user.email,
      'Сброс пароля',
      `<p>Для сброса пароля перейдите по ссылке:</p><p><a href="${link}">${link}</a></p>`,
    );
    return { ok: true };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.userRepository.findOne({ where: { passwordResetToken: token } });
    if (!user) return { ok: false, error: 'Invalid token' };
    if (user.passwordResetExpiresAt && user.passwordResetExpiresAt.getTime() < Date.now()) {
      return { ok: false, error: 'Token expired' };
    }
    const hash = await bcrypt.hash(newPassword, 10);
    user.password = hash;
    user.passwordResetToken = null as any;
    user.passwordResetExpiresAt = null;
    await this.userRepository.save(user);
    return { ok: true };
  }

  async resendActivation(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) return { ok: true };
    if (user.isActive) return { ok: true };
    user.activationToken = randomBytes(32).toString('hex');
    user.activationExpiresAt = new Date(Date.now() + 1000 * 60 * 60);
    await this.userRepository.save(user);
    await this.sendActivation(user);
    return { ok: true };
  }

  async resendPhoneCode(phone: string) {
    const user = await this.userRepository.findOne({ where: { phone } });
    if (!user) return { ok: true };
    if (user.isActive) return { ok: true };
    const code = String(Math.floor(100000 + Math.random() * 900000));
    user.phoneVerificationCode = code;
    user.phoneCodeExpiresAt = new Date(Date.now() + 1000 * 60 * 10);
    await this.userRepository.save(user);
    await this.smsService.sendSms(user.phone!, `Код подтверждения: ${code}`);
    return { ok: true };
  }
}
