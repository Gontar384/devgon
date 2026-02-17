import { client } from '@/lib/graphql/graphqlClient';
import {
  CREATE_CONTENT,
  DELETE_CONTENT,
  GET_CONTENTS,
  REORDER_CONTENTS,
  UPDATE_CONTENT,
} from '@/lib/graphql/contentGraphql';
import api from '@/lib/auth/axios';
import axios from 'axios';
import { Content, MediaItem, MediaType } from '@/content/content-types';

export async function getContents(key: string): Promise<Content[]> {
  const res = await client.requestWithRedirect<{ getContents: Content[] }>(
    GET_CONTENTS,
    { key },
  );
  return res.getContents ?? [];
}

export async function createContent(key: string): Promise<boolean> {
  const res = await client.requestWithRedirect<{ createContent: boolean }>(
    CREATE_CONTENT,
    { key },
  );
  return res.createContent ?? false;
}

export async function updateContent(
  id: string,
  payload: {
    title?: string;
    header?: string;
    description?: string;
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
        header: payload.header,
        description: payload.description,
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

export async function deleteContent(id: string): Promise<boolean> {
  const res = await client.requestWithRedirect<{ deleteContent: boolean }>(
    DELETE_CONTENT,
    { id },
  );
  return res.deleteContent;
}

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
