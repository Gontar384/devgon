'use client';

import { create } from 'zustand';
import { DeviceState } from '@/store/types';

export const useDeviceStore = create<DeviceState>((set) => ({
  isMobile: false,
  detectDevice: () => {
    if (typeof window === 'undefined') return;

    const initialIsMobile = window.innerWidth <= 768;
    set({ isMobile: initialIsMobile });

    const handleTouch = () => {
      set({ isMobile: true });
      cleanup();
    };

    const handleMouse = () => {
      set({ isMobile: false });
      cleanup();
    };

    const cleanup = () => {
      window.removeEventListener('touchstart', handleTouch);
      window.removeEventListener('mousedown', handleMouse);
    };

    window.addEventListener('touchstart', handleTouch, { once: true });
    window.addEventListener('mousedown', handleMouse, { once: true });
  },
}));
