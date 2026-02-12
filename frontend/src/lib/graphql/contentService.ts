import { client } from '@/lib/graphql/graphqlClient';
import { Content } from '@/lib/graphql/graphql-types';
import {
  CREATE_CONTENT,
  DELETE_CONTENT,
  GET_CONTENTS,
  REORDER_CONTENTS,
  UPDATE_CONTENT,
} from '@/lib/graphql/contentGraphql';
import api from '@/lib/auth/axios';

/**
 * Pobiera wszystkie contenty dla klucza
 * Backend automatycznie generuje signed URLs
 */
export async function getContents(key: string): Promise<Content[]> {
  const res = await client.requestWithRedirect<{ getContents: Content[] }>(
    GET_CONTENTS,
    { key },
  );
  return res.getContents ?? [];
}

/**
 * Tworzy pusty content
 * WAŻNE: Nie zwraca danych - wywołaj revalidate po tej operacji!
 */
export async function createContent(key: string): Promise<boolean> {
  const res = await client.requestWithRedirect<{ createContent: boolean }>(
    CREATE_CONTENT,
    { key },
  );
  return res.createContent ?? false;
}

/**
 * Główna metoda do aktualizacji contentu
 *
 * WORKFLOW:
 * 1. Aktualizuje pola tekstowe + usuwa media + zmienia kolejność (GraphQL)
 * 2. Uploaduje nowe media (REST) - jeśli są
 * 3. Nie zwraca danych - wywołaj revalidate!
 *
 * @param id - ID contentu
 * @param input - Dane do aktualizacji
 * @param maxMedia - Opcjonalny limit mediów
 */
export async function updateContent(
  id: string,
  input: {
    title?: string;
    header?: string;
    description?: string;
    existingMediaIds?: string[]; // Do zmiany kolejności
    deleteMediaIds?: string[]; // Do usunięcia
    newMedia?: File[]; // Do dodania
  },
  maxMedia?: number,
): Promise<boolean> {
  try {
    // KROK 1: Aktualizuj pola tekstowe i zarządzaj istniejącymi mediami
    const graphqlInput = {
      title: input.title,
      header: input.header,
      description: input.description,
      existingMediaIds: input.existingMediaIds,
      deleteMediaIds: input.deleteMediaIds,
    };

    await client.requestWithRedirect<{ updateContent: boolean }>(
      UPDATE_CONTENT,
      { id, input: graphqlInput },
    );

    // KROK 2: Upload nowych mediów (jeśli są)
    if (input.newMedia?.length) {
      await uploadMedia(id, input.newMedia, maxMedia);
    }

    return true;
  } catch (error) {
    console.error('❌ Update failed:', error);
    throw error;
  }
}

/**
 * Uploaduje media dla contentu przez REST endpoint
 * Prywatna funkcja - używana tylko przez updateContent
 */
async function uploadMedia(
  contentId: string,
  files: File[],
  maxMedia?: number,
): Promise<void> {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append('files', file);
  });

  if (maxMedia !== undefined) {
    formData.append('maxMedia', maxMedia.toString());
  }

  try {
    await api.post(`/api/media/upload/${contentId}`, formData);
  } catch (error) {
    console.error('❌ Media upload failed:', error);
    throw new Error('Nie udało się uploadować mediów');
  }
}

/**
 * Usuwa content wraz z mediami
 */
export async function deleteContent(id: string): Promise<boolean> {
  const res = await client.requestWithRedirect<{ deleteContent: boolean }>(
    DELETE_CONTENT,
    { id },
  );
  return res.deleteContent;
}

/**
 * Zmienia kolejność contentów
 */
export async function reorderContents(
  key: string,
  ids: string[],
): Promise<boolean> {
  const res = await client.requestWithRedirect<{ reorderContents: boolean }>(
    REORDER_CONTENTS,
    { key, ids },
  );
  return res.reorderContents;
}
