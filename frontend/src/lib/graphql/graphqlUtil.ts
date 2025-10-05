import { gql } from 'graphql-request';
import { GetContentData, UpsertContentData } from '@/app/about/util/types';
import { client } from '@/lib/graphql/graphqlClient';

const GET_CONTENT = gql`
  query GetContent($key: String!) {
    getContent(key: $key) {
      key
      title
      description
      editable
    }
  }
`;

const UPSERT_CONTENT = gql`
  mutation UpsertContent($key: String!, $input: ContentInput!) {
    upsertContent(key: $key, input: $input) {
      title
      description
    }
  }
`;

export async function getContent(key: string) {
  try {
    const data = await client.request<GetContentData>(GET_CONTENT, { key });
    return data?.getContent ?? null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function upsertContent(
  key: string,
  input: { title?: string; description?: string },
) {
  try {
    const data = await client.request<UpsertContentData>(UPSERT_CONTENT, {
      key,
      input,
    });
    return data?.upsertContent ?? null;
  } catch (err) {
    console.error(err);
    return null;
  }
}
