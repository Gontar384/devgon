import { GraphQLClient, ClientError } from 'graphql-request';
import { AUTH_ENDPOINTS } from '@/lib/auth/authActions';

export class AppGraphQLClient extends GraphQLClient {
  async requestWithRedirect<T = any>(
    query: string,
    variables?: Record<string, any>,
  ): Promise<T> {
    try {
      return await this.request<T>(query, variables);
    } catch (err) {
      if (err instanceof ClientError) {
        if (
          err.response.errors?.some(
            (e) => e.extensions?.code === 'UNAUTHENTICATED',
          )
        ) {
          window.location.href = '/';
          return Promise.reject('Unauthorized');
        }
      }
      throw err;
    }
  }
}

export const client = new AppGraphQLClient(AUTH_ENDPOINTS.graphql, {
  credentials: 'include',
  fetch,
});
