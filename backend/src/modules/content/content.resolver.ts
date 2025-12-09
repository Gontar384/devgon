import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ContentService } from './content.service';
import { UseGuards } from '@nestjs/common';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../auth/auth.types';
import { ContentModel } from './content.model';
import { ContentInput } from './content.input';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Resolver(() => ContentModel)
export class ContentResolver {
  constructor(private readonly contentService: ContentService) {}

  //SINGLE CONTENT
  @Query(() => ContentModel, { nullable: true })
  async getContent(@Args('key') key: string) {
    return await this.contentService.getByKey(key);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Mutation(() => ContentModel)
  async upsertContent(
    @Args('key') key: string,
    @Args('input') input: ContentInput,
  ) {
    return await this.contentService.upsertByKey(key, input);
  }

  //MULTIPLE CONTENT
  @Query(() => ContentModel, { nullable: true })
  async getContentById(@Args('id') id: string) {
    return await this.contentService.getById(id);
  }

  @Query(() => [ContentModel])
  async getContents(@Args('key') key: string) {
    return await this.contentService.getMany(key);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Mutation(() => ContentModel)
  async createContent(
    @Args('key') key: string,
    @Args('input') input: ContentInput,
  ) {
    return await this.contentService.create(key, input);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Mutation(() => ContentModel)
  async updateContent(
    @Args('id') id: string,
    @Args('input') input: ContentInput,
  ) {
    return await this.contentService.update(id, input);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Mutation(() => Boolean)
  async deleteContent(@Args('id') id: string) {
    return await this.contentService.delete(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Mutation(() => Boolean)
  async reorderContents(
    @Args('key') key: string,
    @Args({ name: 'ids', type: () => [String] }) ids: string[],
  ) {
    return await this.contentService.reorder(key, ids);
  }
}
