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

export const CREATE_CONTENT = gql`
  mutation CreateContent($key: String!, $input: ContentInput!) {
    createContent(key: $key, input: $input) {
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
        url
        type
        order
      }
    }
  }
`;

export const UPDATE_CONTENT = gql`
  mutation UpdateContent($id: String!, $input: ContentInput!) {
    updateContent(id: $id, input: $input) {
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
        url
        type
        order
      }
    }
  }
`;

export const DELETE_CONTENT = gql`
  mutation DeleteContent($id: String!) {
    deleteContent(id: $id)
  }
`;

export const REORDER_CONTENTS = gql`
  mutation ReorderContents($key: String!, $ids: [String!]!) {
    reorderContents(key: $key, ids: $ids)
  }
`;
