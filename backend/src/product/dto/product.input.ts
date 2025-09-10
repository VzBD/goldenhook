import { InputType, Field, Float } from '@nestjs/graphql';

@InputType()
export class ProductInput {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => Float)
  price: number;

  @Field({ nullable: true })
  image?: string;

  @Field({ nullable: true })
  brand?: string;

  @Field({ nullable: true })
  category?: string;
}
