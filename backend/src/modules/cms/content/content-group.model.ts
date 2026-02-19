import { Field, ObjectType } from '@nestjs/graphql';
import { ContentModel } from './content.model';

@ObjectType()
export class ContentGroupModel {
  @Field()
  key: string;

  @Field(() => [ContentModel])
  items: ContentModel[];
}
