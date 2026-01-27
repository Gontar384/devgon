import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ContentService } from './content.service';
import { UseGuards } from '@nestjs/common';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../auth/auth.types';
import { ContentModel } from './content.model';
import { ContentInput } from './content.input';
import { AuthSessionGuard } from '../auth/auth-session.guard';

@Resolver(() => ContentModel)
export class ContentResolver {
  constructor(private readonly contentService: ContentService) {}

  @Query(() => [ContentModel])
  async getContents(@Args('key') key: string) {
    return await this.contentService.getMany(key);
  }

  @UseGuards(AuthSessionGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Mutation(() => ContentModel)
  async createContent(
    @Args('key') key: string,
    @Args('input') input: ContentInput,
  ) {
    return await this.contentService.create(key, input);
  }

  @UseGuards(AuthSessionGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Mutation(() => ContentModel)
  async updateContent(
    @Args('id') id: string,
    @Args('input') input: ContentInput,
  ) {
    return await this.contentService.update(id, input);
  }

  @UseGuards(AuthSessionGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Mutation(() => Boolean)
  async deleteContent(@Args('id') id: string) {
    return await this.contentService.delete(id);
  }

  @UseGuards(AuthSessionGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Mutation(() => Boolean)
  async reorderContents(
    @Args('key') key: string,
    @Args({ name: 'ids', type: () => [String] }) ids: string[],
  ) {
    return await this.contentService.reorder(key, ids);
  }
}
