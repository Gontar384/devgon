import { client } from '@/lib/graphql/graphqlClient';
import {
  CREATE_CONTENT,
  DELETE_CONTENT,
  GET_CONTENTS,
  REORDER_CONTENTS,
  UPDATE_CONTENT,
} from '@/lib/graphql/contentGraphql';
import api from '@/lib/axios';
import axios from 'axios';
import { Content, MediaItem, MediaType } from '@/cms/content/content-types';

/**
 * Client-side service for managing CMS content blocks via GraphQL and REST.
 *
 * Most operations communicate through the GraphQL API using `client.requestWithRedirect`,
 * which automatically handles session expiry by redirecting to the login page.
 *
 * The exception is media upload, which uses a REST endpoint (`/api/media/upload/:contentId`)
 * because GraphQL does not natively support multipart file uploads in this setup.
 *
 * Intended for use in admin panel components only.
 */

/**
 * Fetches all content blocks for a given page section key.
 * Used exclusively by SWR in admin panel components for live client-side refresh.
 * For server-side fetching with ISR support, use loadPageContents instead.
 *
 * @param key - The page section identifier (e.g. "hero", "team")
 * @returns Ordered list of content blocks with media, or an empty array on failure
 */
export async function getContents(key: string): Promise<Content[]> {
  const res = await client.requestWithRedirect<{ getContents: Content[] }>(
    GET_CONTENTS,
    { key },
  );
  return res.getContents ?? [];
}

/**
 * Creates a new empty content block for a given page section key.
 * The block is appended at the end of the existing list on the server.
 *
 * @param key - The page section identifier
 * @returns `true` if creation succeeded
 */
export async function createContent(key: string): Promise<boolean> {
  const res = await client.requestWithRedirect<{ createContent: boolean }>(
    CREATE_CONTENT,
    { key },
  );
  return res.createContent ?? false;
}

/**
 * Updates a content block's text fields and media.
 *
 * This is a two-step operation:
 * 1. **Media upload** — any `MediaItem` with `type: "new"` is uploaded to the server
 *    via REST. The response maps each `tempId` to a real server-assigned ID.
 * 2. **GraphQL mutation** — the full update is sent, including text fields and a
 *    `mediaOrder` array that references both existing media (by ID) and newly
 *    uploaded media (by `tempId`), along with their desired display order.
 *
 * @param id - ID of the content block to update
 * @param payload - Updated text fields, JSON and the full list of media items in desired order
 * @param maxMedia - Optional server-enforced cap on the number of media files
 * @returns `true` on success
 * @throws Re-throws any network or server error for the caller to handle
 */
export async function updateContent(
  id: string,
  payload: {
    title?: string;
    subtitle?: string;
    description?: string;
    customData?: Record<string, any>;
    mediaItems: MediaItem[];
  },
  maxMedia?: number,
) {
  try {
    const uploadedMediaMap = await uploadMedia(id, payload.mediaItems);

    const mediaOrder = payload.mediaItems.map((item, index) => ({
      kind: item.type === 'existing' ? ('existing' as const) : ('new' as const),
      id: item.type === 'existing' ? item.id : uploadedMediaMap.get(item.id),
      tempId: item.type === 'new' ? item.id : undefined,
      order: index,
    }));

    await client.requestWithRedirect(UPDATE_CONTENT, {
      id,
      input: {
        title: payload.title,
        subtitle: payload.subtitle,
        description: payload.description,
        customData: payload.customData,
        mediaOrder,
      },
      maxMedia,
    });

    return true;
  } catch (error) {
    console.error('❌ Update failed:', error);
    throw error;
  }
}

/**
 * Uploads new media files to the server for a given content block.
 * Only items with `type: "new"` are included — existing media is skipped.
 *
 * Files are sent as `multipart/form-data`. Each file's client-generated `id`
 * is used as its `tempId`, enabling the server to match uploaded files
 * to their positions in the subsequent GraphQL update.
 *
 * @param contentId - ID of the content block the files belong to
 * @param mediaItems - Full list of media items (only new ones are uploaded)
 * @returns Map of `tempId → server-assigned media ID` for all uploaded files
 * @throws Error if the upload request fails
 */
async function uploadMedia(
  contentId: string,
  mediaItems: MediaItem[],
): Promise<Map<string, string>> {
  const newItems = mediaItems.filter((item) => item.type === 'new');

  if (newItems.length === 0) {
    return new Map();
  }

  const formData = new FormData();

  newItems.forEach((item) => {
    formData.append('files', item.data.file);
  });

  formData.append('tempIds', JSON.stringify(newItems.map((item) => item.id)));

  try {
    const response = await api.post<{
      success: boolean;
      media: Array<{
        id: string;
        tempId: string;
        filename: string;
        type: MediaType;
        order: number;
      }>;
    }>(`/api/media/upload/${contentId}`, formData);

    console.log('✅ Upload response:', response.data);

    const map = new Map<string, string>();
    response.data.media.forEach((m) => {
      map.set(m.tempId, m.id);
    });

    return map;
  } catch (error) {
    console.error('❌ Media upload failed:', error);
    if (axios.isAxiosError(error) && error.response) {
      console.error('❌ Response data:', error.response.data);
    }
    throw new Error('Could not upload Media');
  }
}

/**
 * Deletes a content block and all its associated media.
 *
 * @param id - ID of the content block to delete
 * @returns `true` if deleted, `false` if not found
 */
export async function deleteContent(id: string): Promise<boolean> {
  const res = await client.requestWithRedirect<{ deleteContent: boolean }>(
    DELETE_CONTENT,
    { id },
  );
  return res.deleteContent;
}

/**
 * Reorders content blocks under a given page section key.
 * The position of each ID in the `ids` array becomes its new display order.
 *
 * @param key - The page section identifier
 * @param ids - Ordered array of content block IDs representing the new sequence
 * @returns `true` on success
 */
export async function reorderContents(
  key: string,
  ids: string[],
): Promise<boolean> {
  const res = await client.requestWithRedirect<{ reorderContents: boolean }>(
    REORDER_CONTENTS,
    { key, ids },
  );
  return res.reorderContents;
}
