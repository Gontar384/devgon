import { gql } from 'graphql-request';

export const GET_CONTENTS = gql`
  query GetContents($key: String!) {
    getContents(key: $key) {
      id
      key
      title
      header
      description
      order
      updatedAt
      media {
        id
        filename
        mimeType
        type
        size
        alt
        order
        url
        createdAt
        updatedAt
      }
    }
  }
`;

/**
 * Tworzy pusty content - zwraca tylko boolean
 * Frontend powinien zrobić revalidate po tej operacji
 */
export const CREATE_CONTENT = gql`
  mutation CreateContent($key: String!) {
    createContent(key: $key)
  }
`;

/**
 * Aktualizuje content - zwraca tylko boolean
 * Frontend powinien zrobić revalidate po tej operacji
 */
export const UPDATE_CONTENT = gql`
  mutation UpdateContent($id: String!, $input: ContentInput!) {
    updateContent(id: $id, input: $input)
  }
`;

/**
 * Usuwa content wraz z mediami
 */
export const DELETE_CONTENT = gql`
  mutation DeleteContent($id: String!) {
    deleteContent(id: $id)
  }
`;

/**
 * Zmienia kolejność contentów
 */
export const REORDER_CONTENTS = gql`
  mutation ReorderContents($key: String!, $ids: [String!]!) {
    reorderContents(key: $key, ids: $ids)
  }
`;
