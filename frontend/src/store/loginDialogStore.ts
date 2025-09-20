'use client';

import { create } from 'zustand';
import { LoginDialogState } from '@/store/types/types';

export const useLoginDialogStore = create<LoginDialogState>((set) => ({
  dialogOpen: false,
  setDialogOpen: (open: boolean) => set({ dialogOpen: open }),
}));
