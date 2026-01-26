import { GraphQLClient } from 'graphql-request';
import { refreshAccessToken } from '@/lib/auth/refresh-manager';
import { AUTH_ENDPOINTS } from '@/lib/auth/authActions';

export class AuthGraphQLClient extends GraphQLClient {
  async request(query: any, variables?: any) {
    try {
      return await super.request(query, variables);
    } catch (err: any) {
      if (err.response?.status !== 401) throw err;

      await refreshAccessToken(fetch);
      return super.request(query, variables);
    }
  }
}

export const client = new AuthGraphQLClient(AUTH_ENDPOINTS.graphql, {
  credentials: 'include',
  fetch,
});
