'use client';
import React, { useState } from 'react';
import { AuthButtonProps } from '@/app/layout/types';
import { LoginButton } from '@/app/layout/ui/navbar/auth-button/LoginButton';
import { LogoutButton } from '@/app/layout/ui/navbar/auth-button/LogoutButton';

export function AuthButton({ isMobileBar, authUser }: AuthButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [logoutCooldown, setLogoutCooldown] = useState(false);

  return (
    <div
      className={`gap-2 select-none ${isMobileBar ? 'flex mt-8' : 'hidden md:flex mr-5'}`}
      aria-label="Akcje użytkownika"
    >
      <LoginButton
        isMobileBar={isMobileBar}
        authUser={authUser}
        showTooltip={showTooltip}
        setShowTooltip={setShowTooltip}
        logoutCooldown={logoutCooldown}
        setLogoutCooldown={setLogoutCooldown}
      />
      <LogoutButton
        authUser={authUser}
        showTooltip={showTooltip}
        setShowTooltip={setShowTooltip}
        setLogoutCooldown={setLogoutCooldown}
      />
    </div>
  );
}
