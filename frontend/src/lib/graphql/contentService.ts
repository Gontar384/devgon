import { client } from '@/lib/graphql/graphqlClient';
import { Content } from '@/lib/graphql/graphql-types';
import {
  CREATE_CONTENT,
  DELETE_CONTENT,
  GET_CONTENTS,
  REORDER_CONTENTS,
  UPDATE_CONTENT,
} from '@/lib/graphql/contentGraphql';

export async function getContents(key: string): Promise<Content[]> {
  const res = await client.requestWithRedirect<{ getContents: Content[] }>(
    GET_CONTENTS,
    {
      key,
    },
  );
  return res.getContents ?? [];
}

export async function createContent(
  key: string,
  input: Partial<Content>,
): Promise<Content | null> {
  const res = await client.requestWithRedirect<{ createContent: Content }>(
    CREATE_CONTENT,
    {
      key,
      input,
    },
  );
  return res.createContent ?? null;
}

export async function updateContent(
  id: string,
  input: Partial<Content>,
): Promise<Content | null> {
  const res = await client.requestWithRedirect<{ updateContent: Content }>(
    UPDATE_CONTENT,
    {
      id,
      input,
    },
  );
  return res.updateContent ?? null;
}

export async function deleteContent(id: string): Promise<boolean> {
  const res = await client.requestWithRedirect<{ deleteContent: boolean }>(
    DELETE_CONTENT,
    {
      id,
    },
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
