import { Controller, Post, Body, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';
import type { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('phone') phone: string | undefined,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.register(email, password, phone);
    const isAdmin = user.role === 'admin';
    res.cookie('userId', String(user.id), { httpOnly: true, sameSite: 'lax' });
    res.cookie('email', user.email, { httpOnly: true, sameSite: 'lax' });
    res.cookie('role', user.role, { httpOnly: true, sameSite: 'lax' });
    res.cookie('isAdmin', String(isAdmin), { httpOnly: true, sameSite: 'lax' });
    return { id: user.id, email: user.email, role: user.role };
  }

  @Post('activate/email')
  async activateEmail(@Body('token') token: string) {
    return this.authService.activateByEmailToken(token);
  }

  @Post('activate/email/resend')
  async resendEmail(@Body('email') email: string) {
    return this.authService.resendActivation(email);
  }

  @Post('activate/phone')
  async activatePhone(@Body('phone') phone: string, @Body('code') code: string) {
    return this.authService.activateByPhoneCode(phone, code);
  }

  @Post('activate/phone/resend')
  async resendPhone(@Body('phone') phone: string) {
    return this.authService.resendPhoneCode(phone);
  }

  @Post('password/forgot')
  async forgot(@Body('email') email: string) {
    return this.authService.requestPasswordReset(email);
  }

  @Post('password/reset')
  async reset(@Body('token') token: string, @Body('newPassword') newPassword: string) {
    return this.authService.resetPassword(token, newPassword);
  }

  @Post('login')
  async login(@Body('email') email: string, @Body('password') password: string, @Res({ passthrough: true }) res: Response) {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      return { error: 'Invalid credentials' };
    }
    // Устанавливаем простые cookie (httpOnly) для middleware и guard
    const isAdmin = user.role === 'admin';
  const cookieOpts = { httpOnly: true, sameSite: 'lax' as const, secure: process.env.NODE_ENV === 'production' };
  res.cookie('userId', String(user.id), cookieOpts);
  res.cookie('email', user.email, cookieOpts);
  res.cookie('role', user.role, cookieOpts);
  res.cookie('isAdmin', String(isAdmin), cookieOpts);
    return { id: user.id, email: user.email, role: user.role };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
  const cookieOpts = { httpOnly: true, sameSite: 'lax' as const, secure: process.env.NODE_ENV === 'production' };
  res.clearCookie('userId', cookieOpts);
  res.clearCookie('email', cookieOpts);
  res.clearCookie('role', cookieOpts);
  res.clearCookie('isAdmin', cookieOpts);
    return { ok: true };
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const user = req.user;
    const isAdmin = user.role === 'admin';
  const cookieOpts = { httpOnly: true, sameSite: 'lax' as const, secure: process.env.NODE_ENV === 'production' };
  res.cookie('userId', String(user.id), cookieOpts);
  res.cookie('email', user.email, cookieOpts);
  res.cookie('role', user.role, cookieOpts);
  res.cookie('isAdmin', String(isAdmin), cookieOpts);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    return res.redirect(frontendUrl + '/account');
  }

  @Get('me')
  async me(@Req() req: Request) {
    const userId = req.cookies?.userId;
    if (!userId) return { authenticated: false };
    const idNum = parseInt(String(userId), 10);
    if (Number.isNaN(idNum)) return { authenticated: false };
    const user = await this.authService.getById(idNum);
    if (!user) return { authenticated: false };
  return { authenticated: true, user: { id: user.id, email: user.email, role: user.role, isActive: user.isActive } };
  }
}
