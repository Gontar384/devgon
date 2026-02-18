import { GraphQLClient, ClientError } from 'graphql-request';
import { AUTH_ENDPOINTS } from '@/lib/auth/authActions';

/**
 * Extended GraphQL client that handles session expiry globally.
 * On any UNAUTHENTICATED error, redirects the user to the homepage
 * instead of propagating the error to the caller.
 */
export class AppGraphQLClient extends GraphQLClient {
  /**
   * Executes a GraphQL request. If the server returns an UNAUTHENTICATED error,
   * redirects to "/" and rejects the promise. All other errors are re-thrown.
   */
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
