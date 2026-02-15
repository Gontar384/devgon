import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
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
  async getContents(@Args('key') key: string): Promise<ContentModel[]> {
    const data = await this.contentService.getMany(key);
    return data as unknown as ContentModel[];
  }

  @UseGuards(AuthSessionGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Mutation(() => Boolean)
  async createContent(@Args('key') key: string): Promise<boolean> {
    await this.contentService.create(key);
    return true;
  }

  @UseGuards(AuthSessionGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Mutation(() => Boolean)
  async updateContent(
    @Args('id') id: string,
    @Args('input') input: ContentInput,
    @Args('maxMedia', { type: () => Int, nullable: true }) maxMedia?: number,
  ): Promise<boolean> {
    await this.contentService.update(id, input, maxMedia);
    return true;
  }

  @UseGuards(AuthSessionGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Mutation(() => Boolean)
  async deleteContent(@Args('id') id: string): Promise<boolean> {
    return await this.contentService.delete(id);
  }

  @UseGuards(AuthSessionGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Mutation(() => Boolean)
  async reorderContents(
    @Args('key') key: string,
    @Args({ name: 'ids', type: () => [String] }) ids: string[],
  ): Promise<boolean> {
    return await this.contentService.reorder(key, ids);
  }
}
