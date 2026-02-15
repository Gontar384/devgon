import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { MediaType } from './media.entity';

registerEnumType(MediaType, {
  name: 'MediaType',
  description: 'Type of media (image or video)',
});

@ObjectType()
export class MediaModel {
  @Field()
  id: string;

  @Field()
  filename: string;

  @Field()
  storageKey: string;

  @Field()
  mimeType: string;

  @Field(() => MediaType)
  type: MediaType;

  @Field(() => Int)
  size: number;

  @Field({ nullable: true })
  alt?: string;

  @Field(() => Int)
  order: number;

  @Field()
  contentId: string;

  @Field()
  url?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
