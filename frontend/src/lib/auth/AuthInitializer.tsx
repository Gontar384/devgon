'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export function AuthInitializer() {
  const fetchUser = useAuthStore((state) => state.fetchUser);

  useEffect(() => {
    void fetchUser();
  }, [fetchUser]);

  return null;
}
