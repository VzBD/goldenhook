import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Balance } from './balance.entity';
import { User } from '../user/user.entity';

@Injectable()
export class BalanceService {
  constructor(
    @InjectRepository(Balance)
    private balanceRepository: Repository<Balance>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getUserBalance(userId: number): Promise<number> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');
    const transactions = await this.balanceRepository.find({ where: { user: { id: userId } } });
    return transactions.reduce((sum, t) => sum + t.amount, 0);
  }

  async addTransaction(userId: number, amount: number, type: string): Promise<Balance> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');
    const transaction = this.balanceRepository.create({ user, amount, type });
    return this.balanceRepository.save(transaction);
  }

  async getHistory(userId: number): Promise<Balance[]> {
    return this.balanceRepository.find({ where: { user: { id: userId } }, order: { createdAt: 'DESC' } });
  }
}
