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

  @Query(() => ContentModel, { nullable: true })
  async getContent(@Args('key') key: string) {
    return this.contentService.getByKey(key);
  }

  @Query(() => [ContentModel])
  async getAllContentByKey(@Args('key') key: string) {
    return this.contentService.getAllByKey(key);
  }

  @Mutation(() => ContentModel)
  @Roles(UserRole.ADMIN)
  @Mutation(() => ContentModel)
  async createContent(
    @Args('key') key: string,
    @Args('input') input: ContentInput,
  ) {
    return this.contentService.create(key, input);
  }

  @Mutation(() => [ContentModel])
  @Roles(UserRole.ADMIN)
  @Mutation(() => ContentModel)
  async reorderContent(
    @Args('key') key: string,
    @Args({ name: 'orderedIds', type: () => [String] }) orderedIds: string[],
  ) {
    return this.contentService.reorder(key, orderedIds);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Mutation(() => ContentModel)
  async upsertContent(
    @Args('key') key: string,
    @Args('input') input: ContentInput,
  ) {
    return this.contentService.upsert(key, input);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Mutation(() => ContentModel)
  async addImageToContent(
    @Args('key') key: string,
    @Args('image') image: string,
  ) {
    return this.contentService.addImage(key, image);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Mutation(() => ContentModel, { nullable: true })
  async removeImageFromContent(
    @Args('key') key: string,
    @Args('index') index: number,
  ) {
    return this.contentService.removeImage(key, index);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Mutation(() => ContentModel)
  async setVideoForContent(
    @Args('key') key: string,
    @Args('video') video: string,
  ) {
    return this.contentService.setVideo(key, video);
  }
}
