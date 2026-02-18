import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ContentService } from './content.service';
import { UseGuards } from '@nestjs/common';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../auth/auth.types';
import { ContentModel } from './content.model';
import { ContentInput } from './content.input';
import { AuthSessionGuard } from '../auth/auth-session.guard';

/**
 * GraphQL resolver for content block operations.
 *
 * Exposes one public query (`getContents`) and four admin-only mutations
 * protected by `AuthSessionGuard` and `RolesGuard` with `UserRole.ADMIN`.
 * All business logic is delegated to `ContentService`.
 */
@Resolver(() => ContentModel)
export class ContentResolver {
  constructor(private readonly contentService: ContentService) {}

  /**
   * Returns all content blocks for a given page section key,
   * sorted by order. Publicly accessible — no authentication required.
   *
   * @param key - The page section identifier (e.g. "hero", "team")
   * @returns Ordered list of content blocks with media
   */
  @Query(() => [ContentModel])
  async getContents(@Args('key') key: string): Promise<ContentModel[]> {
    const data = await this.contentService.getMany(key);
    return data as unknown as ContentModel[];
  }

  /**
   * Creates a new empty content block for the given page section key.
   * The block is appended at the end of the existing list.
   *
   * @requires ADMIN role
   * @param key - The page section identifier
   * @returns `true` on success
   */
  @UseGuards(AuthSessionGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Mutation(() => Boolean)
  async createContent(@Args('key') key: string): Promise<boolean> {
    await this.contentService.create(key);
    return true;
  }

  /**
   * Updates a content block's text fields and media.
   * Accepts an optional `maxMedia` limit — if the final media count
   * exceeds it, newly uploaded files are rolled back and an error is returned.
   *
   * @requires ADMIN role
   * @param id - ID of the content block to update
   * @param input - New text values and desired media order
   * @param maxMedia - Optional maximum number of allowed media files
   * @returns `true` on success
   */
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

  /**
   * Deletes a content block and all its associated media files.
   * Remaining blocks under the same key are automatically reindexed.
   *
   * @requires ADMIN role
   * @param id - ID of the content block to delete
   * @returns `true` if deleted, `false` if not found
   */
  @UseGuards(AuthSessionGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Mutation(() => Boolean)
  async deleteContent(@Args('id') id: string): Promise<boolean> {
    return await this.contentService.delete(id);
  }

  /**
   * Reorders content blocks under a given key.
   * The position of each ID in the `ids` array becomes its new `order` value.
   *
   * @requires ADMIN role
   * @param key - The page section identifier
   * @param ids - Ordered array of content block IDs
   * @returns `true` on success
   */
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
