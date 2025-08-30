'use client';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useDeviceStore } from '../../../../store/deviceStore';
import { useMobileBarStore } from '../../../../store/mobileBarStore';

interface Props {
  isMobileBar: boolean;
}

export const LoginButton: React.FC<Props> = ({ isMobileBar }) => {
  const [show, setShow] = useState(false);
  const [display, setDisplay] = useState(false);
  const { isMobile } = useDeviceStore();
  const { mobileBarOpened, setMobileBarOpened } = useMobileBarStore();

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

  const handleClick = () => {
    if (isMobile) {
      setDisplay(false);
    }
  };

  return (
    <Tooltip
      open={(!isMobile && show) || (isMobile && display)}
      onOpenChange={setShow}
    >
      <TooltipTrigger asChild>
        <Button
          size="lg"
          className="hover:scale-105 active:scale-105 cursor-pointer hover:bg-primary select-none"
          onClick={handleClick}
        >
          Zaloguj się
        </Button>
      </TooltipTrigger>
      <TooltipContent
        className="w-64 flex"
        side="bottom"
        onClick={() => setDisplay(false)}
      >
        <span>
          Zaloguj się za pomocą Google
          <Image
            src="/svg/google.svg"
            width={16}
            height={16}
            alt="Google"
            className="inline align-text-bottom select-none ml-1 mr-1.5"
            priority
          />
          i odblokuj pełne możliwości naszej strony!
        </span>
        <Image
          className="select-none"
          src="/svg/tooltip-login-girl.svg"
          alt="Google icon"
          width={64}
          height={64}
          priority
        />
      </TooltipContent>
    </Tooltip>
  );
};
