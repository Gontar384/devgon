import { createMetadata } from '@/lib/metadata';
import { Metadata } from 'next';
import aboutData from '@/app/home/util/homeData.json';
import { verifyAuth } from '@/lib/auth/verifyAuth';
import { AboutManager } from '@/app/about/ui/AboutManager';
import gql from 'graphql-tag';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

export const generateMetadata = (): Metadata =>
  createMetadata(aboutData.metaData);

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

async function getContent() {
  try {
    const ssrClient = new ApolloClient({
      link: new HttpLink({
        uri: `${process.env.NEXT_PUBLIC_BACKEND_URL}/graphql`,
        credentials: 'include',
        fetch,
      }),
      cache: new InMemoryCache(),
    });

    const { data } = await ssrClient.query({
      query: GET_CONTENT,
      variables: { key: 'about-page' },
    });

    return data.getContent;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export default async function AboutPage() {
  const authUser = await verifyAuth('/about');
  await getContent();
  return <AboutManager />;
}
