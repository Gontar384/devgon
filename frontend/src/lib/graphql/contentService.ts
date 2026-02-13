import { client } from '@/lib/graphql/graphqlClient';
import { Content } from '@/lib/graphql/graphql-types';
import {
  CREATE_CONTENT,
  DELETE_CONTENT,
  GET_CONTENTS,
  REORDER_CONTENTS,
  UPDATE_CONTENT,
} from '@/lib/graphql/contentGraphql';
import api from '@/lib/auth/axios';

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
  input: {
    title?: string;
    header?: string;
    description?: string;
    newMedia?: File[];
    existingMediaIds?: string[];
    deleteMediaIds?: string[];
  },
  maxMedia?: number,
): Promise<boolean> {
  try {
    const graphqlInput = {
      title: input.title,
      header: input.header,
      description: input.description,
      existingMediaIds: input.existingMediaIds,
      deleteMediaIds: input.deleteMediaIds,
    };

    await client.requestWithRedirect<{ updateContent: boolean }>(
      UPDATE_CONTENT,
      { id, input: graphqlInput },
    );

    if (input.newMedia?.length) {
      await uploadMedia(id, input.newMedia, maxMedia);
    }

    return true;
  } catch (error) {
    console.error('❌ Update failed:', error);
    throw error;
  }
}

async function uploadMedia(
  contentId: string,
  files: File[],
  maxMedia?: number,
): Promise<void> {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append('files', file);
  });

  if (maxMedia !== undefined) {
    formData.append('maxMedia', maxMedia.toString());
  }

  try {
    await api.post(`/api/media/upload/${contentId}`, formData);
  } catch (error) {
    console.error('❌ Media upload failed:', error);
    throw new Error('Nie udało się uploadować mediów');
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
