import { client } from '@/lib/graphql/graphqlClient';
import { Content } from '@/lib/graphql/graphql-types';
import {
  CREATE_CONTENT,
  DELETE_CONTENT,
  GET_CONTENT,
  GET_CONTENT_BY_ID,
  GET_CONTENTS,
  REORDER_CONTENTS,
  UPDATE_CONTENT,
  UPSERT_CONTENT,
} from '@/lib/graphql/contentGraphql';

//SINGLE CONTENT
export async function getContent(key: string): Promise<Content | null> {
  try {
    const res = await client.request<{ getContent: Content }>(GET_CONTENT, {
      key,
    });
    return res.getContent ?? null;
  } catch (err) {
    console.error('GraphQL getContent error:', err);
    return null;
  }
}

export async function upsertContent(
  key: string,
  input: Partial<Content>,
): Promise<Content | null> {
  try {
    const res = await client.request<{ upsertContent: Content }>(
      UPSERT_CONTENT,
      { key, input },
    );
    return res.upsertContent ?? null;
  } catch (err) {
    console.error('GraphQL upsertContent error:', err);
    return null;
  }
}

//MULTIPLE CONTENT
export async function getContentById(id: string): Promise<Content | null> {
  try {
    const res = await client.request<{ getContentById: Content }>(
      GET_CONTENT_BY_ID,
      { id },
    );
    return res.getContentById ?? null;
  } catch (err) {
    console.error('GraphQL getContentById error:', err);
    return null;
  }
}

export async function getContents(key: string): Promise<Content[]> {
  try {
    const res = await client.request<{ getContents: Content[] }>(GET_CONTENTS, {
      key,
    });
    return res.getContents ?? [];
  } catch (err) {
    console.error('GraphQL getContents error:', err);
    return [];
  }
}

export async function createContent(
  key: string,
  input: Partial<Content>,
): Promise<Content | null> {
  try {
    const res = await client.request<{ createContent: Content }>(
      CREATE_CONTENT,
      { key, input },
    );
    return res.createContent ?? null;
  } catch (err) {
    console.error('GraphQL createContent error:', err);
    return null;
  }
}

export async function updateContent(
  id: string,
  input: Partial<Content>,
): Promise<Content | null> {
  try {
    const res = await client.request<{ updateContent: Content }>(
      UPDATE_CONTENT,
      { id, input },
    );
    return res.updateContent ?? null;
  } catch (err) {
    console.error('GraphQL updateContent error:', err);
    return null;
  }
}

export async function deleteContent(id: string): Promise<boolean> {
  try {
    const res = await client.request<{ deleteContent: boolean }>(
      DELETE_CONTENT,
      { id },
    );
    return res.deleteContent;
  } catch (err) {
    console.error('GraphQL deleteContent error:', err);
    return false;
  }
}

export async function reorderContents(
  key: string,
  ids: string[],
): Promise<boolean> {
  try {
    const res = await client.request<{ reorderContents: boolean }>(
      REORDER_CONTENTS,
      { key, ids },
    );
    return res.reorderContents;
  } catch (err) {
    console.error('GraphQL reorderContents error:', err);
    return false;
  }
}
