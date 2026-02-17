import { getContents } from '@/content/util/service/contentService';
import { Content, UsePageContentsResult } from '@/content/content-types';

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
