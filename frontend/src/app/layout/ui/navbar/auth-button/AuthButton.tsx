'use client';
import React, { useState } from 'react';
import { AuthButtonProps } from '@/app/layout/layout-types';
import { LoginButton } from '@/app/layout/ui/navbar/auth-button/LoginButton';
import { LogoutButton } from '@/app/layout/ui/navbar/auth-button/LogoutButton';
import { AdminButton } from '@/app/layout/ui/navbar/auth-button/AdminButton';
import { useAuthStore } from '@/store/authStore';
import { Skeleton } from '@/components/ui/skeleton';

export function AuthButton({ isMobileBar }: AuthButtonProps) {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const [showTooltip, setShowTooltip] = useState(false);
  const [logoutCooldown, setLogoutCooldown] = useState(false);

  const isAdmin = user.role === 'admin';

  if (isLoading) {
    return (
      <Skeleton
        className={`h-10 w-36 bg-primary/40 ${isMobileBar ? 'mt-12' : 'hidden md:flex'}`}
        aria-busy="true"
      />
    );
  }

  return (
    <div
      role="toolbar"
      className={`gap-2 select-none ${isMobileBar ? 'flex mt-12' : 'hidden md:flex'}`}
      aria-label="Akcje użytkownika"
    >
      {isAdmin && <AdminButton />}
      <LoginButton
        isMobileBar={isMobileBar}
        authUser={user}
        showTooltip={showTooltip}
        setShowTooltip={setShowTooltip}
        logoutCooldown={logoutCooldown}
        setLogoutCooldown={setLogoutCooldown}
      />
      <LogoutButton
        authUser={user}
        showTooltip={showTooltip}
        setShowTooltip={setShowTooltip}
        setLogoutCooldown={setLogoutCooldown}
      />
    </div>
  );
}
