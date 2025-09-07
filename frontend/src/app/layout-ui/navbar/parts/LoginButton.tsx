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

export const LoginButton: React.FC<LoginButtonProps> = ({ isMobileBar }) => {
  const [show, setShow] = useState(false);
  const [display, setDisplay] = useState(false);
  const { isMobile } = useDeviceStore();
  const { mobileBarOpened, setMobileBarOpened } = useMobileBarStore();
  const typedLoginButton: LoginButtonData = layoutData.loginButton;

  useEffect(() => {
    if (!isMobile || mobileBarOpened || !isMobileBar) return;
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

  return (
    <div
      className={`${isMobileBar ? 'flex flex-col gap-3 mt-8' : 'hidden md:flex mr-4'}`}
      aria-label="Akcje użytkownika"
    >
      <Tooltip
        open={(!isMobile && show) || (isMobile && display)}
        onOpenChange={setShow}
      >
        <TooltipTrigger asChild>
          <Button
            size="lg"
            className="hover:scale-105 active:scale-105 cursor-pointer hover:bg-primary select-none"
            onClick={handleLogin}
          >
            {typedLoginButton.buttonContent}
          </Button>
        </TooltipTrigger>
        <TooltipContent
          className="w-64 flex"
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
              className="inline align-text-bottom select-none ml-1 mr-1.5"
              priority
            />
            {typedLoginButton.tooltipContent1}
          </span>
          <Image
            className="select-none"
            src={typedLoginButton.image1Src}
            alt={typedLoginButton.image1Alt}
            width={typedLoginButton.image1W}
            height={typedLoginButton.image1H}
            priority
          />
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
