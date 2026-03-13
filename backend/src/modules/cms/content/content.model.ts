import { Field, ID, ObjectType } from '@nestjs/graphql';
import { MediaModel } from './media/media.model';
import GraphQLJSON from 'graphql-type-json';

@ObjectType()
export class ContentModel {
  @Field(() => ID)
  id: string;

  @Field()
  key: string;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  subtitle?: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => GraphQLJSON, { nullable: true })
  customData?: Record<string, any>;

  @Field(() => [MediaModel], { nullable: true })
  media?: MediaModel[];

  @Field({ nullable: true })
  order: number;

  @Field()
  updatedAt: Date;
}
