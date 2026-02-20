import { getContents } from '@/cms/content/util/service/contentService';
import { Content, UsePageContentsResult } from '@/cms/content/content-types';

/**
 * Fetches content blocks for multiple page section keys in parallel.
 * Uses allSettled — if some keys fail, the rest are still returned.
 * Failed keys are collected in `failedKeys` rather than throwing.
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
        contents[key] = await getContents(key);
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
