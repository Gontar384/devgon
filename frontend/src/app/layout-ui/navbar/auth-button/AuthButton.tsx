'use client';
import React, { useEffect, useRef, useState } from 'react';
import { AuthButtonProps } from '@/app/layout-ui/types';
import { LoginButton } from '@/app/layout-ui/navbar/auth-button/LoginButton';
import { LogoutButton } from '@/app/layout-ui/navbar/auth-button/LogoutButton';
import { LoginDialog } from '@/app/layout-ui/navbar/auth-button/LoginDialog';
import { refreshAuth } from '@/lib/auth/refreshAuth';

export function AuthButton({ isMobileBar, authUser }: AuthButtonProps) {
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!authUser || authUser.role === 'guest') return;

    if (!intervalRef.current) {
      intervalRef.current = setInterval(
        async () => {
          await refreshAuth();
        },
        5 * 60 * 1000,
      );
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [authUser]);

  return (
    <div
      className={`gap-2 select-none ${isMobileBar ? 'flex mt-8' : 'hidden md:flex mr-8'}`}
      aria-label="Akcje użytkownika"
    >
      <LoginButton
        authUser={authUser}
        isMobileBar={isMobileBar}
        show={show}
        setShow={setShow}
        setOpen={setOpen}
      />
      <LogoutButton authUser={authUser} show={show} setShow={setShow} />
      <LoginDialog open={open} setOpen={setOpen} />
    </div>
  );
}
