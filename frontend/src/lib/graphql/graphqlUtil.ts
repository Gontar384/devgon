import { gql } from 'graphql-request';
import { client } from '@/lib/graphql/graphqlClient';
import { Content } from '@/lib/graphql/types';

const GET_CONTENT = gql`
  query GetContent($key: String!) {
    getContent(key: $key) {
      id
      key
      title
      header
      description
      images
      video
      order
      createdAt
      updatedAt
    }
  }
`;

const UPSERT_CONTENT = gql`
  mutation UpsertContent($key: String!, $input: ContentInput!) {
    upsertContent(key: $key, input: $input) {
      id
      key
      title
      header
      description
      images
      video
      order
      createdAt
      updatedAt
    }
  }
`;

export async function getContent(key: string): Promise<Content | null> {
  try {
    const res = await client.request<{ getContent: Content }>(GET_CONTENT, {
      key,
    });
    return res?.getContent ?? null;
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
      {
        key,
        input,
      },
    );
    return res?.upsertContent ?? null;
  } catch (err) {
    console.error('GraphQL upsertContent error:', err);
    return null;
  }
}
