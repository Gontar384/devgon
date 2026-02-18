'use client';

import { create } from 'zustand';
import { MobileBarState } from '@/store/store-types';

export const useMobileBarStore = create<MobileBarState>((set) => ({
  openedBar: false,
  toggleBar: () => set((state) => ({ openedBar: !state.openedBar })),
  closeBar: () => set({ openedBar: false }),
  mobileBarOpened: false,
  setMobileBarOpened: (opened: boolean) => set({ mobileBarOpened: opened }),
  /** Flag used to suppress scroll-triggered side effects during programmatic navigation. */
  programmaticScroll: false,
  setProgrammaticScroll: (v: boolean) => set({ programmaticScroll: v }),
}));
