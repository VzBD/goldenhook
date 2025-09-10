import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class SpecKV {
  @Field()
  key: string;

  @Field()
  value: string;
}

@ObjectType()
export class Review {
  @Field(() => ID)
  id: string;

  @Field()
  author: string;

  @Field(() => Int)
  rating: number;

  @Field()
  comment: string;

  // Используем строку ISO вместо отдельного Scalar Date
  @Field()
  createdAt: string;
}
