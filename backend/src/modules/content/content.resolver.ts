// src/modules/content/content.resolver.ts
import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { ContentService } from './content.service';
import { UseGuards } from '@nestjs/common';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../auth/auth.types';
import { ContentModel } from './content.model';
import { ContentInput } from './content.input';
import { AuthSessionGuard } from '../auth/auth-session.guard';
import { MediaModel } from './media/media.model';
import { MinioService } from '../../config/minio/minio.service';

@Resolver(() => ContentModel)
export class ContentResolver {
  constructor(
    private readonly contentService: ContentService,
    private readonly minioService: MinioService,
  ) {}

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

  @ResolveField(() => [MediaModel])
  async media(@Parent() content: ContentModel): Promise<MediaModel[]> {
    if (!content.media || content.media.length === 0) {
      return [];
    }

    return await Promise.all(
      content.media.map(async (m) => ({
        ...m,
        url: await this.minioService.getSignedUrl(m.storageKey, 3600),
      })),
    );
  }
}
