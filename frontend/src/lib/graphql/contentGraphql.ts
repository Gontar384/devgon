import { gql } from 'graphql-request';

export const GET_CONTENTS = gql`
  query GetContents($key: String!) {
    getContents(key: $key) {
      id
      key
      title
      subtitle
      description
      order
      updatedAt
      customData
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
  mutation CreateContent($key: String!) {
    createContent(key: $key)
  }
`;

export const UPDATE_CONTENT = gql`
  mutation UpdateContent($id: String!, $input: ContentInput!, $maxMedia: Int) {
    updateContent(id: $id, input: $input, maxMedia: $maxMedia)
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

export const GET_CONTENTS_QUERY = `
  query GetContents($key: String!) {
    getContents(key: $key) {
      id
      key
      title
      subtitle
      description
      order
      updatedAt
      customData
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
