import { Field, ID, InputType } from '@nestjs/graphql';

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
