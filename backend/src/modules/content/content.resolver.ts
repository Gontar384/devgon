import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ContentService } from './content.service';
import { Content } from './content.model';
import { UpsertContentInput } from './content.input';
import { UseGuards } from '@nestjs/common';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../auth/auth.types';
import { AuthGuard } from '@nestjs/passport';

@Resolver(() => Content)
export class ContentResolver {
  constructor(private readonly contentService: ContentService) {}

  @Query(() => [Content])
  getAllContent() {
    return this.contentService.getAll();
  }

  @Query(() => Content, { nullable: true })
  getContent(@Args('key') key: string) {
    return this.contentService.getByKey(key);
  }

  @Mutation(() => Content)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  upsertContent(
    @Args('key') key: string,
    @Args('input') input: UpsertContentInput,
  ) {
    return this.contentService.upsert(key, input);
  }
}
