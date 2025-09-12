'use client';

import { create } from 'zustand';
import { MobileBarState } from '@/store/types/mobilebar-types';

export const useMobileBarStore = create<MobileBarState>((set) => ({
  open: false,
  toggle: () => set((state) => ({ open: !state.open })),
  close: () => set({ open: false }),
  mobileBarOpened: false,
  setMobileBarOpened: (opened: boolean) => set({ mobileBarOpened: opened }),
}));
