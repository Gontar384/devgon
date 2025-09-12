export interface MobileBarState {
  open: boolean;
  toggle: () => void;
  close: () => void;
  mobileBarOpened: boolean;
  setMobileBarOpened: (opened: boolean) => void;
}
