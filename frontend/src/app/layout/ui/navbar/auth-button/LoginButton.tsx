import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { LoginButtonProps } from '@/app/layout/layout-types';
import { useDeviceStore } from '@/store/deviceStore';
import { useMobileBarStore } from '@/store/mobileBarStore';
import { useLoginDialogStore } from '@/store/loginDialogStore';

export function LoginButton({
  authUser,
  isMobileBar,
  showTooltip,
  setShowTooltip,
  logoutCooldown,
  setLogoutCooldown,
}: LoginButtonProps) {
  const { isMobile } = useDeviceStore();
  const { mobileBarOpened, setMobileBarOpened, openedBar } =
    useMobileBarStore();
  const { dialogOpen, setDialogOpen } = useLoginDialogStore();
  const isAuthenticated = authUser.role !== 'guest';
  const [showTooltipOnMobile, setShowTooltipOnMobile] = useState(false);

  useEffect(() => {
    if (
      dialogOpen ||
      !isMobileBar ||
      isAuthenticated ||
      !isMobile ||
      mobileBarOpened
    )
      return;
    setMobileBarOpened(true);
    const timeout = setTimeout(() => {
      setShowTooltipOnMobile(true);
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogOpen]);

  const handleOpenDialog = async () => {
    if (isAuthenticated) return;
    setShowTooltipOnMobile(false);
    setDialogOpen(true);
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (logoutCooldown) {
      timeout = setTimeout(() => {
        setLogoutCooldown(false);
        setShowTooltip(false);
      }, 1000);
    }
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logoutCooldown]);

  return (
    <Tooltip
      open={
        (!isAuthenticated && !isMobile && showTooltip && !logoutCooldown) ||
        (!isAuthenticated && isMobile && showTooltipOnMobile && openedBar)
      }
      onOpenChange={setShowTooltip}
    >
      <TooltipTrigger asChild>
        <Button
          variant="default"
          size="lg"
          className={`w-36 ${isAuthenticated ? 'pointer-events-none bg-secondary' : 'hover:scale-105 active:scale-105 cursor-pointer hover:bg-primary'}`}
          onClick={!isAuthenticated ? handleOpenDialog : undefined}
        >
          <span className="truncate min-w-0 flex-1 text-center">
            {isAuthenticated
              ? (authUser.email?.split('@')[0] ?? 'Użytkownik')
              : 'Zaloguj się'}
          </span>
        </Button>
      </TooltipTrigger>
      <TooltipContent
        className="w-60 flex select-none !z-45"
        side="bottom"
        onClick={() => setShowTooltipOnMobile(false)}
      >
        <span>Zaloguj się i odblokuj pełne możliwości naszej strony!</span>
        <Image
          src="/svg/tooltip-login-girl.svg"
          alt="Login icon"
          width={48}
          height={48}
          priority
        />
      </TooltipContent>
    </Tooltip>
  );
}
