'use client';

import { create } from 'zustand';

interface MobileBarState {
  open: boolean;
  toggle: () => void;
  close: () => void;
  mobileBarOpened: boolean;
  setMobileBarOpened: (opened: boolean) => void;
}

export const useMobileBarStore = create<MobileBarState>((set) => ({
  open: false,
  toggle: () => set((state) => ({ open: !state.open })),
  close: () => set({ open: false }),
  mobileBarOpened: false,
  setMobileBarOpened: (opened: boolean) => set({ mobileBarOpened: opened }),
}));
