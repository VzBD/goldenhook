import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { BalanceService } from './balance.service';

@Controller('balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Get(':userId')
  async getUserBalance(@Param('userId') userId: number) {
    return { balance: await this.balanceService.getUserBalance(userId) };
  }

  @Post('add')
  async addTransaction(
    @Body('userId') userId: number,
    @Body('amount') amount: number,
    @Body('type') type: string,
  ) {
    return await this.balanceService.addTransaction(userId, amount, type);
  }

  @Get('history/:userId')
  async getHistory(@Param('userId') userId: number) {
    return await this.balanceService.getHistory(userId);
  }
}
