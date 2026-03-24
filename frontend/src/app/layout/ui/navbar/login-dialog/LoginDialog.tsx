'use client';

import * as React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useMobileBarStore } from '@/store/mobileBarStore';
import { useLoginDialogStore } from '@/store/loginDialogStore';
import { loginWithGoogle } from '@/lib/auth/authActions';

export function LoginDialog() {
  const { dialogOpen, setDialogOpen } = useLoginDialogStore();
  const { openedBar, setIsNavigating } = useMobileBarStore();
  const scrollYRef = useRef(0);
  const [animateState, setAnimateState] = useState<'closed' | 'open'>('closed');
  const [mounted, setMounted] = useState(false);

  const handleLogin = () => {
    loginWithGoogle();
  };

  useEffect(() => {
    if (!openedBar) {
      if (mounted) {
        scrollYRef.current = window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollYRef.current}px`;
        document.body.style.width = '100%';
      } else {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollYRef.current);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  useEffect(() => {
    if (dialogOpen) {
      setMounted(true);
      setTimeout(() => setAnimateState('open'), 0);
    } else {
      setIsNavigating(true);
      setAnimateState('closed');
      const timeoutMounted = setTimeout(() => {
        setMounted(false);
      }, 200);
      const timeoutScroll = setTimeout(() => {
        setIsNavigating(false);
      }, 250);
      return () => {
        clearTimeout(timeoutMounted);
        clearTimeout(timeoutScroll);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogOpen]);

  if (!mounted) return null;

  return (
    <div
      className={`fixed inset-0 z-50 h-screen flex items-center justify-center bg-black/80 transition-opacity duration-200 
      ${animateState === 'open' ? 'opacity-100' : 'opacity-0'}`}
      aria-modal="true"
      role="dialog"
    >
      <div
        className={`relative w-full max-w-md rounded-[1.2rem] bg-background p-6 shadow-lg select-none transition-all duration-200
          ${animateState === 'open' ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
      >
        <div className="flex flex-col space-y-2 text-center md:text-left mb-4">
          <h2 className="text-3xl font-semibold">Logowanie</h2>
          <p className="text-sm text-muted-foreground">
            Zaloguj się, używając którejś z poniższych metod
          </p>
        </div>
        <Card className="shadow-none bg-background border-border/50">
          <CardContent className="space-y-3">
            <Button
              autoFocus
              className="w-full flex items-center cursor-pointer hover:scale-105 active:scale-105 hover:bg-primary"
              onClick={handleLogin}
            >
              <Image
                src="/svg/login/google.svg"
                alt="Zaloguj się za pomocą Google"
                width={24}
                height={24}
                priority
              />
              Zaloguj przez Google
            </Button>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              variant="secondary"
              className="cursor-pointer text-primary-foreground hover:scale-105 active:scale-105 hover:bg-secondary"
              onClick={() => setDialogOpen(false)}
            >
              Anuluj
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
