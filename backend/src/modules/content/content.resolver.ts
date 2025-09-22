import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ContentService } from './content.service';
import { UseGuards } from '@nestjs/common';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../auth/auth.types';
import { ContentModel } from './graphql/content.model';
import { UpsertContentInput } from './graphql/content.input';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Resolver(() => ContentModel)
export class ContentResolver {
  constructor(private readonly contentService: ContentService) {}

  @Query(() => [ContentModel])
  async getAllContent() {
    const entities = await this.contentService.getAll();
    return entities.map((e) => ({ ...e }));
  }

  @Query(() => ContentModel, { nullable: true })
  async getContent(@Args('key') key: string) {
    const entity = await this.contentService.getByKey(key);
    return entity ? { ...entity } : null;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Mutation(() => ContentModel)
  async upsertContent(
    @Args('key') key: string,
    @Args('input') input: UpsertContentInput,
  ) {
    const entity = await this.contentService.upsert(key, input);
    return { ...entity };
  }
}
