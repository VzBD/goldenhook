import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { GoogleStrategy } from './google.strategy';
import { EmailService } from '../common/email.service';
import { SmsService } from '../common/sms.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [AuthService, GoogleStrategy, EmailService, SmsService],
  controllers: [AuthController],
})
export class AuthModule {}
