import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { SpecKV, Review } from './product.types';

@ObjectType()
@Entity()
export class Product {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column({ type: 'text' })
  description: string;

  @Field(() => Float)
  @Column({ type: 'float' })
  price: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  image: string | null;

  // Ниже — дополнительные GraphQL-поля (не сохраняются в БД)
  @Field({ nullable: true })
  @Column({ nullable: true })
  brand?: string | null;

  @Field({ nullable: true })
  @Column({ nullable: true })
  category?: string | null;

  @Field({ nullable: true })
  sku?: string | null;

  @Field(() => Float, { nullable: true })
  oldPrice?: number | null;

  @Field(() => [String], { nullable: 'itemsAndList' })
  images?: string[] | null;

  @Field(() => [SpecKV], { nullable: 'itemsAndList' })
  specs?: SpecKV[] | null;

  @Field(() => [Review], { nullable: 'itemsAndList' })
  reviews?: Review[] | null;

  @Field(() => [Product], { nullable: 'itemsAndList' })
  related?: Product[] | null;

  @Field({ nullable: true })
  @Column({ type: 'boolean', default: true })
  inStock?: boolean | null;
}
