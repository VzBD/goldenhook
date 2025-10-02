import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private readonly disabled: boolean;

  constructor(private readonly authService: AuthService) {
    const cid = process.env.GOOGLE_CLIENT_ID || 'disabled';
    const csec = process.env.GOOGLE_CLIENT_SECRET || 'disabled';
    const cb = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:4000/auth/google/callback';
    const isDisabled = cid === 'disabled' || csec === 'disabled';
    super({ clientID: cid, clientSecret: csec, callbackURL: cb, scope: isDisabled ? [] : ['email', 'profile'] });
    this.disabled = isDisabled;
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    if (this.disabled) {
      return done(new Error('Google OAuth is disabled in this environment'), null);
    }
    const { emails, displayName } = profile;
    const email = emails && emails[0] && emails[0].value;
    // Проверяем, есть ли пользователь с таким email, если нет — создаём
    const user = await this.authService.findOrCreateGoogleUser(email, displayName);
    done(null, user);
  }
}
