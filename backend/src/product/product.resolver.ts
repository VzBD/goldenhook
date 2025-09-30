import { Resolver, Query, Args, Int, ID, ObjectType, Field, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Product } from './product.entity';
import { ProductService } from './product.service';
import { ProductInput } from './dto/product.input';

@ObjectType()
class CatalogResult {
  @Field(() => [Product])
  items: Product[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  pageSize: number;

  @Field(() => [String])
  brands: string[];

  @Field(() => [String])
  categories: string[];
}

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Query(() => [Product])
  async products(@Args('limit', { type: () => Int, nullable: true }) limit = 8): Promise<Product[]> {
    const { items } = await this.productService.getAll(1, limit);
    return items.map((p) => this.hydrateComputedFields(p));
  }

  @Query(() => CatalogResult)
  async catalog(
    @Args('page', { type: () => Int, nullable: true }) page = 1,
    @Args('pageSize', { type: () => Int, nullable: true }) pageSize = 12,
    @Args('brand', { type: () => String, nullable: true }) _brand?: string,
    @Args('q', { type: () => String, nullable: true }) q?: string,
    @Args('category', { type: () => String, nullable: true }) _category?: string,
    @Args('priceFrom', { type: () => Int, nullable: true }) priceFrom?: number,
    @Args('priceTo', { type: () => Int, nullable: true }) priceTo?: number,
    @Args('inStock', { type: () => Boolean, nullable: true }) inStock?: boolean,
    @Args('sort', { type: () => String, nullable: true }) sort?: 'price_asc' | 'price_desc' | 'new' | 'popular',
  ): Promise<CatalogResult> {
    const { items, total } = await this.productService.getAll(page, pageSize, q || '', {
      brand: _brand,
      category: _category,
      priceFrom: priceFrom ?? undefined,
      priceTo: priceTo ?? undefined,
      inStock: typeof inStock === 'boolean' ? inStock : undefined,
      sort: sort as any,
    });
    const hydrated = items.map((p) => this.hydrateComputedFields(p));

    // Заглушки: бренды/категории собираем из имеющихся полей или подставляем
    const brands = Array.from(new Set(hydrated.map((p) => p.brand).filter(Boolean))) as string[];
    const categories = Array.from(new Set(hydrated.map((p) => p.category).filter(Boolean))) as string[];

    return {
      items: hydrated,
      total,
      page,
      pageSize,
      brands,
      categories,
    };
  }

  @Query(() => Product, { nullable: true })
  async product(@Args('id', { type: () => ID }) id: number): Promise<Product | null> {
    const p = await this.productService.getById(Number(id));
    return p ? this.hydrateComputedFields(p) : null;
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Query(() => CatalogResult)
  async adminProducts(
    @Args('page', { type: () => Int, nullable: true }) page = 1,
    @Args('pageSize', { type: () => Int, nullable: true }) pageSize = 20,
    @Args('q', { type: () => String, nullable: true }) q?: string,
  ): Promise<CatalogResult> {
    const { items, total } = await this.productService.getAll(page, pageSize, q || '');
    const hydrated = items.map((p) => this.hydrateComputedFields(p));
    return { items: hydrated, total, page, pageSize, brands: [], categories: [] };
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Mutation(() => Product)
  async createProduct(@Args('input', { type: () => ProductInput }) input: ProductInput): Promise<Product> {
    const created = await this.productService.create(input);
    return this.hydrateComputedFields(created);
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Mutation(() => Product)
  async updateProduct(
    @Args('id', { type: () => ID }) id: number,
    @Args('input', { type: () => ProductInput }) input: ProductInput,
  ): Promise<Product> {
    const updated = await this.productService.update(Number(id), input);
    return this.hydrateComputedFields(updated);
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Mutation(() => Boolean)
  async deleteProduct(@Args('id', { type: () => ID }) id: number): Promise<boolean> {
    await this.productService.remove(Number(id));
    return true;
  }

  private hydrateComputedFields(p: Product): Product {
    // Простейшие вычисляемые/заглушечные поля для соответствия фронту
    if (!p.image) {
      p.image = null;
    }
    p.brand = p.brand ?? 'Golden Hook';
    p.category = p.category ?? 'Default';
    p.sku = p.sku ?? `SKU-${p.id}`;
    p.oldPrice = p.oldPrice ?? Math.round(p.price * 1.1 * 100) / 100;
    p.images = p.images ?? (p.image ? [p.image] : []);
    p.specs = p.specs ?? [
      { key: 'Материал', value: 'Металл' },
      { key: 'Вес', value: '10 г' },
    ];
    p.reviews = p.reviews ?? [
      { id: `r-${p.id}-1`, author: 'Гость', rating: 5, comment: 'Отличное качество', createdAt: new Date().toISOString() },
    ];
    p.related = p.related ?? [];
    return p;
  }
}
