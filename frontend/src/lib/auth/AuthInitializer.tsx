'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

/**
 * Invisible component mounted at the app root to hydrate auth state on load.
 * Calls fetchUser once on mount — result is stored in useAuthStore.
 */
export function AuthInitializer() {
  const fetchUser = useAuthStore((state) => state.fetchUser);

  useEffect(() => {
    void fetchUser();
  }, [fetchUser]);

  return null;
}
