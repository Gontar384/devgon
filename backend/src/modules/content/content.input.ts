import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ContentInput {
  @Field({ nullable: true })
  key?: string;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => [String], { nullable: true })
  images?: string[];

  @Field({ nullable: true })
  video?: string;

  @Field({ nullable: true })
  editable?: boolean;
}
