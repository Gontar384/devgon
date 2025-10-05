'use client';
import { useEffect, useRef } from 'react';
import { refreshAuth } from '@/lib/auth/refreshAuth';
import { NavbarProps } from '@/app/layout/types';

export function AuthProvider({ authUser }: NavbarProps) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!authUser || authUser.role === 'guest') return;

    if (!intervalRef.current) {
      intervalRef.current = setInterval(
        async () => {
          await refreshAuth();
        },
        3 * 60 * 1000,
      );
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [authUser]);

  return null;
}
