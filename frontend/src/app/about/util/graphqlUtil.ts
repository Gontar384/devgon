import { ApolloClient, InMemoryCache, HttpLink, gql } from '@apollo/client';
import { GetContentData, UpsertContentData } from '@/app/about/util/types';

const ssrClient = new ApolloClient({
  link: new HttpLink({
    uri: `${process.env.NEXT_PUBLIC_BACKEND_URL}/graphql`,
    credentials: 'include',
    fetch,
  }),
  cache: new InMemoryCache(),
});

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
  mutation UpsertContent($key: String!, $input: UpsertContentInput!) {
    upsertContent(key: $key, input: $input) {
      title
      description
    }
  }
`;

export async function getContent(key: string) {
  try {
    const { data } = await ssrClient.query<GetContentData>({
      query: GET_CONTENT,
      variables: { key },
    });
    return data.getContent;
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
    const { data } = await ssrClient.mutate<UpsertContentData>({
      mutation: UPSERT_CONTENT,
      variables: { key, input },
    });
    return data?.upsertContent ?? null;
  } catch (err) {
    console.error(err);
    return null;
  }
}
