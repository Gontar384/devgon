import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { LoginButtonData, LoginButtonProps } from '@/app/layout-ui/types';
import layoutData from '@/app/layout-ui/layoutData.json';
import { useDeviceStore } from '@/store/deviceStore';
import { useMobileBarStore } from '@/store/mobileBarStore';

export function LoginButton({
  authUser,
  isMobileBar,
  show,
  setShow,
  setOpen,
}: LoginButtonProps) {
  const typedAuthButton: LoginButtonData = layoutData.loginButton;
  const { isMobile } = useDeviceStore();
  const isAuthenticated = authUser.role !== 'guest';
  const [display, setDisplay] = useState(false);
  const { mobileBarOpened, setMobileBarOpened } = useMobileBarStore();

  useEffect(() => {
    if (isAuthenticated || !isMobile || mobileBarOpened || !isMobileBar) return;
    setMobileBarOpened(true);
    const timeout = setTimeout(() => {
      setDisplay(true);
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  const handleOpenDialog = async () => {
    if (isAuthenticated) return;
    setDisplay(false);
    const active = document.activeElement as HTMLElement | null;
    if (active) active.blur();
    setOpen(true);
  };

  return (
    <Tooltip
      open={
        (!isAuthenticated && !isMobile && show) ||
        (!isAuthenticated && isMobile && display)
      }
      onOpenChange={setShow}
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
        onClick={() => setDisplay(false)}
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
