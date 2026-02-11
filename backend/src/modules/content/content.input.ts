import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ContentInput {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  header?: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => [String], { nullable: true })
  existingMediaIds?: string[];

  @Field(() => [String], { nullable: true })
  deleteMediaIds?: string[];

  @Field({ nullable: true })
  order?: number;
}
