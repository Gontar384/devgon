import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { MediaType } from './media-types';

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

  /**
   * Signed MinIO URL for accessing the file. Not stored in the database —
   * generated on-the-fly and attached to the response in ContentService.
   */
  @Field()
  url?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
