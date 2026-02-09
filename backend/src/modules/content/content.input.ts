import { Field, InputType } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload-minimal';

@InputType()
export class ContentInput {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  header?: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => [GraphQLUpload], { nullable: true })
  newMedia?: FileUpload[];

  @Field(() => [String], { nullable: true })
  existingMediaIds?: string[];

  @Field(() => [String], { nullable: true })
  deleteMediaIds?: string[];

  @Field({ nullable: true })
  order?: number;
}
