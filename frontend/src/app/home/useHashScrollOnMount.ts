'use client';
import { useHashScrollOnMount } from '@/app/layout/ui/navbar/useNavigation';

export function HashScrollHandler() {
  useHashScrollOnMount();
  return null;
}
