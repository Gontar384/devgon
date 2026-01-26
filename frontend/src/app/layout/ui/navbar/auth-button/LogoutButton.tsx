import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { DoorOpen } from 'lucide-react';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useDeviceStore } from '@/store/deviceStore';
import { LogoutButtonProps } from '@/app/layout/layout-types';
import { useMobileBarStore } from '@/store/mobileBarStore';
import { toast } from 'sonner';
import { logout } from '@/lib/auth/authActions';

export function LogoutButton({
  authUser,
  showTooltip,
  setShowTooltip,
  setLogoutCooldown,
}: LogoutButtonProps) {
  const router = useRouter();
  const { isMobile } = useDeviceStore();
  const isAuthenticated = authUser.role !== 'guest';
  const { openedBar, closeBar } = useMobileBarStore();

  const handleLogout = async () => {
    if (!isAuthenticated) return;
    try {
      await logout();
      window.location.href = '/';
      router.refresh();
      if (openedBar) closeBar();
      setLogoutCooldown(true);
      toast.success('Zostałeś wylogowany👋');
    } catch {
      console.error('Unable to log out');
    }
  };

  return (
    <>
      {isAuthenticated && (
        <Tooltip open={!isMobile && showTooltip} onOpenChange={setShowTooltip}>
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
            <span>Wyloguj się</span>
          </TooltipContent>
        </Tooltip>
      )}
    </>
  );
}
