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
  mobileScreen: boolean;
}

export const LoginButton: React.FC<Props> = ({ mobileScreen }) => {
  const { isMobile } = useDeviceStore();
  const [show, setShow] = useState(false);
  const { mobileBarOpened, setMobileBarOpened } = useMobileBarStore();

  useEffect(() => {
    if (mobileBarOpened) return;
    const timeout = setTimeout(() => {
      if (mobileScreen) {
        setShow(true);
        setMobileBarOpened(true);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [mobileBarOpened, mobileScreen, setMobileBarOpened]);

  const handleClick = () => {
    if (mobileScreen) {
      setShow(false);
    }
  };

  return (
    <Tooltip open={show} onOpenChange={setShow}>
      <TooltipTrigger asChild>
        <Button
          size="lg"
          className="hover:scale-105 active:scale-105 cursor-pointer hover:bg-primary select-none"
          onClick={handleClick}
        >
          Zaloguj się
        </Button>
      </TooltipTrigger>
      {(!isMobile || (isMobile && mobileScreen && show)) && (
        <TooltipContent
          className="w-64 flex"
          side="bottom"
          onClick={() => setShow(false)}
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
            src="/svg/login-girl.svg"
            alt="Google icon"
            width={64}
            height={64}
            priority
          />
        </TooltipContent>
      )}
    </Tooltip>
  );
};
