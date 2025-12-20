'use client';
import React, { useState } from 'react';
import { AuthButtonProps } from '@/app/layout/layout-types';
import { LoginButton } from '@/app/layout/ui/navbar/auth-button/LoginButton';
import { LogoutButton } from '@/app/layout/ui/navbar/auth-button/LogoutButton';
import { AdminButton } from '@/app/layout/ui/navbar/auth-button/AdminButton';

export function AuthButton({ isMobileBar, authUser }: AuthButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [logoutCooldown, setLogoutCooldown] = useState(false);
  const isAdmin = authUser.role === 'admin';

  return (
    <div
      className={`gap-2 select-none ${isMobileBar ? 'flex mt-8' : 'hidden md:flex mr-5'}`}
      aria-label="Akcje użytkownika"
    >
      {isAdmin && <AdminButton />}
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
