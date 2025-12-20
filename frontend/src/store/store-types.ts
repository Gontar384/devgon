export interface DeviceState {
  isMobile: boolean;
  detectDevice: () => void;
}

export interface MobileBarState {
  openedBar: boolean;
  toggleBar: () => void;
  closeBar: () => void;
  mobileBarOpened: boolean;
  setMobileBarOpened: (opened: boolean) => void;
  programmaticScroll: boolean;
  setProgrammaticScroll: (v: boolean) => void;
}

export interface LoginDialogState {
  dialogOpen: boolean;
  setDialogOpen: (opened: boolean) => void;
}
