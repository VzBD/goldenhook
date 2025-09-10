import { Controller, Get, Query, Param, Post, Put, Delete, Body, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './product.entity';

// Пример простого Guard для проверки роли администратора
class AdminGuard {
  canActivate(context) {
    const req = context.switchToHttp().getRequest();
    // Здесь должна быть реальная проверка авторизации и роли
    return req.user && req.user.role === 'admin';
  }
}

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('search') search: string = '',
  ) {
    return await this.productService.getAll(page, limit, search);
  }

  @Get(':id')
  async getById(@Param('id') id: number) {
    return await this.productService.getById(id);
  }

  @Post()
  @UseGuards(AdminGuard)
  async create(@Body() data: Partial<Product>) {
    return await this.productService.create(data);
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  async update(@Param('id') id: number, @Body() data: Partial<Product>) {
    return await this.productService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async remove(@Param('id') id: number) {
    return await this.productService.remove(id);
  }
}
