import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between, MoreThanOrEqual, LessThanOrEqual, FindOptionsWhere } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async getAll(
    page = 1,
    limit = 20,
    search = '',
    opts?: {
      brand?: string;
      category?: string;
      priceFrom?: number;
      priceTo?: number;
      inStock?: boolean;
      sort?: 'price_asc' | 'price_desc' | 'new' | 'popular';
    },
  ): Promise<{ items: Product[]; total: number }> {
    const where: FindOptionsWhere<Product> = {};
    if (search) where.name = Like(`%${search}%`);
    if (opts?.brand) where.brand = opts.brand;
    if (opts?.category) where.category = opts.category;
    if (typeof opts?.inStock === 'boolean') where.inStock = opts.inStock;

    if (opts?.priceFrom != null && opts?.priceTo != null) {
      (where as any).price = Between(opts.priceFrom, opts.priceTo);
    } else if (opts?.priceFrom != null) {
      (where as any).price = MoreThanOrEqual(opts.priceFrom);
    } else if (opts?.priceTo != null) {
      (where as any).price = LessThanOrEqual(opts.priceTo);
    }

    let order: any = { id: 'DESC' };
    if (opts?.sort === 'price_asc') order = { price: 'ASC' };
    if (opts?.sort === 'price_desc') order = { price: 'DESC' };
    if (opts?.sort === 'new') order = { id: 'DESC' };
    // popular: оставим как id DESC заглушку

    const [items, total] = await this.productRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order,
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
