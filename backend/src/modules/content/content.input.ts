import { Field, ID, InputType } from '@nestjs/graphql';

/**
 * Describes a single media item's position in a content update.
 *
 * - `kind: "existing"` — media already in the database; provide `id`
 * - `kind: "new"` — media just uploaded via REST; provide `tempId`
 *
 * Items absent from this list are treated as removed and will be deleted.
 */
@InputType()
export class MediaOrderInput {
  @Field()
  kind: 'existing' | 'new';

  @Field(() => ID, { nullable: true })
  id?: string;

  @Field({ nullable: true })
  tempId?: string;

  @Field()
  order: number;
}

@InputType()
export class ContentInput {
  @Field({ nullable: true }) title?: string;

  @Field({ nullable: true }) header?: string;

  @Field({ nullable: true }) description?: string;

  @Field(() => [MediaOrderInput])
  mediaOrder: MediaOrderInput[];
}
