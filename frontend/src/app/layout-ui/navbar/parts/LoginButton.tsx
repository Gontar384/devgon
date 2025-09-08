'use client';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useDeviceStore } from '@/store/deviceStore';
import { useMobileBarStore } from '@/store/mobileBarStore';
import { LoginButtonData, LoginButtonProps } from '@/app/layout-ui/types';
import layoutData from '@/app/layout-ui/layoutData.json';
import { DoorOpen } from 'lucide-react';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';

export const LoginButton: React.FC<LoginButtonProps> = ({
  isMobileBar,
  authUser,
}) => {
  const [show, setShow] = useState(false);
  const [display, setDisplay] = useState(false);
  const { isMobile } = useDeviceStore();
  const { mobileBarOpened, setMobileBarOpened, open, close } =
    useMobileBarStore();
  const typedLoginButton: LoginButtonData = layoutData.loginButton;
  const isAuthenticated = authUser.role !== 'guest';
  const router = useRouter();

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

  const handleLogin = () => {
    if (isMobile) {
      setDisplay(false);
    }
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/oauth`;
  };

  const handleLogout = async () => {
    try {
      await api.get('/api/auth/logout');
      router.refresh();
      if (open) close();
    } catch {
      console.error('Unable to log in');
    }
  };

  return (
    <div
      className={`gap-2 select-none ${isMobileBar ? 'flex mt-8' : 'hidden md:flex mr-4'}`}
      aria-label="Akcje użytkownika"
    >
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
            onClick={!isAuthenticated ? handleLogin : undefined}
          >
            <span className="truncate min-w-0 flex-1 text-center">
              {isAuthenticated
                ? (authUser.email?.split('@')[0] ?? typedLoginButton.buttonAlt)
                : typedLoginButton.buttonContent}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent
          className="w-64 flex select-none"
          side="bottom"
          onClick={() => setDisplay(false)}
        >
          <span>
            {typedLoginButton.tooltipContent}
            <Image
              src={typedLoginButton.imageSrc}
              alt={typedLoginButton.imageAlt}
              width={typedLoginButton.imageW}
              height={typedLoginButton.imageH}
              className="inline align-text-bottom ml-1 mr-1.5 select-none"
              priority
            />
            {typedLoginButton.tooltipContent1}
          </span>
          <Image
            src={typedLoginButton.image1Src}
            alt={typedLoginButton.image1Alt}
            width={typedLoginButton.image1W}
            height={typedLoginButton.image1H}
            priority
          />
        </TooltipContent>
      </Tooltip>
      {isAuthenticated && (
        <Tooltip open={!isMobile && show} onOpenChange={setShow}>
          <TooltipTrigger asChild>
            <Button
              variant="default"
              size="lg"
              className={`hover:scale-105 active:scale-105 cursor-pointer`}
              onClick={handleLogout}
            >
              <DoorOpen className="!w-7 !h-7" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="select-none" side="bottom">
            <span>{typedLoginButton.tooltipContent3}</span>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
};
