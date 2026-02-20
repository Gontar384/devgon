import { Field, ID, ObjectType } from '@nestjs/graphql';
import { MediaModel } from './media/media.model';

@ObjectType()
export class ContentModel {
  @Field(() => ID)
  id: string;

  @Field()
  key: string;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  header?: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => [MediaModel], { nullable: true })
  media?: MediaModel[];

  @Field({ nullable: true })
  order: number;

  @Field()
  updatedAt: Date;
}
