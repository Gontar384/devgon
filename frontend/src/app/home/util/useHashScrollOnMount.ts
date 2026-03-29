'use client';
import { useHashScrollOnMount } from '@/app/layout/util/useNavigation';

export function HashScrollHandler() {
  useHashScrollOnMount();
  return null;
}
