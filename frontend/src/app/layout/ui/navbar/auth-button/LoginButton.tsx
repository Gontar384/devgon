import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { LoginButtonData, LoginButtonProps } from '@/app/layout/util/types';
import layoutData from '@/app/layout/util/layoutData.json';
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
  const typedAuthButton: LoginButtonData = layoutData.loginButton;
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
      }, 2000);
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
              ? (authUser.email?.split('@')[0] ?? typedAuthButton.buttonAlt)
              : typedAuthButton.buttonContent}
          </span>
        </Button>
      </TooltipTrigger>
      <TooltipContent
        className="w-60 flex select-none !z-45"
        side="bottom"
        onClick={() => setShowTooltipOnMobile(false)}
      >
        <span>{typedAuthButton.tooltipContent}</span>
        <Image
          src={typedAuthButton.imageSrc}
          alt={typedAuthButton.imageAlt}
          width={typedAuthButton.imageW}
          height={typedAuthButton.imageH}
          priority
        />
      </TooltipContent>
    </Tooltip>
  );
}
