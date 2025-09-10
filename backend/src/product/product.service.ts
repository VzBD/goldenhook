import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async getAll(page = 1, limit = 20, search = ''): Promise<{ items: Product[]; total: number }> {
    const [items, total] = await this.productRepository.findAndCount({
      where: search ? { name: Like(`%${search}%`) } : {},
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'DESC' },
    });
    return { items, total };
  }

  async getById(id: number): Promise<Product> {
    return this.productRepository.findOne({ where: { id } });
  }

  async create(data: Partial<Product>): Promise<Product> {
    const product = this.productRepository.create(data);
    return this.productRepository.save(product);
  }

  async update(id: number, data: Partial<Product>): Promise<Product> {
    await this.productRepository.update(id, data);
    return this.productRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    await this.productRepository.delete(id);
    return { deleted: true };
  }
}
