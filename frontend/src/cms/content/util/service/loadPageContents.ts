import { Content, UsePageContentsResult } from '@/cms/content/content-types';
import { AUTH_ENDPOINTS } from '@/lib/auth/authActions';
import { GET_CONTENTS_QUERY } from '@/lib/graphql/contentGraphql';

/**
 * Fetches a single page section's content via native fetch with Next.js cache tag.
 * Enables on-demand revalidation via revalidateTag(key) from /api/revalidate.
 */
export async function fetchPublicContents(key: string): Promise<Content[]> {
  const response = await fetch(AUTH_ENDPOINTS.graphql, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: GET_CONTENTS_QUERY,
      variables: { key },
    }),
    next: {
      revalidate: 300,
      tags: [key],
    },
  });

  const json = await response.json();
  return json?.data?.getContents ?? [];
}

/**
 * Fetches content blocks for multiple page section keys in parallel.
 * Uses allSettled — if some keys fail, the rest are still returned.
 * Failed keys are collected in `failedKeys` rather than throwing.
 *
 * Uses native fetch instead of graphql-request so Next.js Data Cache
 * can track requests by tag — required for revalidateTag to work on production.
 *
 * @param keys - Page section identifiers to load
 * @returns Map of loaded contents, list of failed keys, and the last error if any
 */
export async function loadPageContents(
  keys: string[],
): Promise<UsePageContentsResult> {
  const contents: Record<string, Content[]> = {};
  const failedKeys: string[] = [];
  let lastError: Error | null = null;

  await Promise.allSettled(
    keys.map(async (key) => {
      try {
        contents[key] = await fetchPublicContents(key);
      } catch (err) {
        failedKeys.push(key);
        lastError = err instanceof Error ? err : new Error('Failed to load');
        console.error(`Failed to load content for key: ${key}`, err);
      }
    }),
  );

  return {
    contents,
    error: failedKeys.length > 0 ? lastError : null,
    failedKeys,
  };
}
