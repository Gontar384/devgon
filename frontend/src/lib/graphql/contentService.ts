import { client } from '@/lib/graphql/graphqlClient';
import { Content, Media } from '@/lib/graphql/graphql-types';
import {
  CREATE_CONTENT,
  DELETE_CONTENT,
  GET_CONTENTS,
  REORDER_CONTENTS,
  UPDATE_CONTENT,
} from '@/lib/graphql/contentGraphql';
import { AUTH_ENDPOINTS } from '@/lib/auth/authActions';

export async function getContents(key: string): Promise<Content[]> {
  const res = await client.requestWithRedirect<{ getContents: Content[] }>(
    GET_CONTENTS,
    { key },
  );
  return res.getContents ?? [];
}

export async function createContent(
  key: string,
  input: Partial<Content>,
): Promise<Content | null> {
  const res = await client.requestWithRedirect<{ createContent: Content }>(
    CREATE_CONTENT,
    { key, input },
  );
  return res.createContent ?? null;
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
): Promise<Content | null> {
  if (!input.newMedia || input.newMedia.length === 0) {
    const res = await client.requestWithRedirect<{ updateContent: Content }>(
      UPDATE_CONTENT,
      { id, input },
    );
    return res.updateContent ?? null;
  }

  return await updateContentWithFiles(id, input);
}

async function updateContentWithFiles(
  id: string,
  input: {
    title?: string;
    header?: string;
    description?: string;
    newMedia?: File[];
    existingMediaIds?: string[];
    deleteMediaIds?: string[];
  },
): Promise<Content | null> {
  const operations = {
    query: UPDATE_CONTENT,
    variables: {
      id,
      input: {
        title: input.title,
        header: input.header,
        description: input.description,
        newMedia: input.newMedia?.map((_, i) => null),
        existingMediaIds: input.existingMediaIds,
        deleteMediaIds: input.deleteMediaIds,
      },
    },
  };

  const map: Record<string, string[]> = {};
  input.newMedia?.forEach((_, i) => {
    map[i.toString()] = [`variables.input.newMedia.${i}`];
  });

  const formData = new FormData();
  formData.append('operations', JSON.stringify(operations));
  formData.append('map', JSON.stringify(map));

  input.newMedia?.forEach((file, i) => {
    formData.append(i.toString(), file);
  });

  const response = await fetch(AUTH_ENDPOINTS.graphql, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Upload failed');
  }

  const result = await response.json();
  return result.data?.updateContent ?? null;
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
