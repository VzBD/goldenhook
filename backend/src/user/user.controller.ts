import { Controller, Get, Put, Body, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Controller('user')
export class UserController {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  @Get(':id')
  async getProfile(@Param('id') id: number) {
    return await this.userRepository.findOne({ where: { id } });
  }

  @Put(':id')
  async updateProfile(
    @Param('id') id: number,
    @Body() data: Partial<User>,
  ) {
    await this.userRepository.update(id, data);
    return await this.userRepository.findOne({ where: { id } });
  }
}
