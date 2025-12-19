import { gql } from 'graphql-request';

//CUSTOM QUERY
export const GET_CONTENTS_BY_KEYS = gql`
  query GetContentsByKeys($keys: [String!]!) {
    getContentsByKeys(keys: $keys) {
      key
      items {
        id
        key
        title
        header
        description
        images
        video
        order
        updatedAt
      }
    }
  }
`;

//SINGLE CONTENT
export const GET_CONTENT = gql`
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
      updatedAt
    }
  }
`;

export const UPSERT_CONTENT = gql`
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
      updatedAt
    }
  }
`;

//MULTIPLE CONTENT
export const GET_CONTENT_BY_ID = gql`
  query GetContentById($id: String!) {
    getContentById(id: $id) {
      id
      key
      title
      header
      description
      images
      video
      order
      updatedAt
    }
  }
`;

export const GET_CONTENTS = gql`
  query GetContents($key: String!) {
    getContents(key: $key) {
      id
      key
      title
      header
      description
      images
      video
      order
      updatedAt
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
      images
      video
      order
      updatedAt
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
      images
      video
      order
      updatedAt
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
