import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ContentModel {
  @Field(() => ID)
  id: string;

  @Field()
  key: string;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => [String], { nullable: true })
  images?: string[];

  @Field({ nullable: true })
  video?: string;

  @Field()
  editable: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
