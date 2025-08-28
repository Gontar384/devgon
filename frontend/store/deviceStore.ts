import { create } from 'zustand';

interface DeviceState {
  isMobile: boolean;
  detectDevice: () => void;
}

export const useDeviceStore = create<DeviceState>((set) => ({
  isMobile: false,
  detectDevice: () => {
    if (typeof window !== 'undefined') {
      const detect = () => {
        const isTouch =
          'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const isSmall = window.innerWidth <= 640;
        set({ isMobile: isTouch || isSmall });
      };

      detect();
      window.addEventListener('resize', detect);
    }
  },
}));
