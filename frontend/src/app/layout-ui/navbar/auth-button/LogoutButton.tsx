import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { DoorOpen } from 'lucide-react';
import React from 'react';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { useDeviceStore } from '@/store/deviceStore';
import { LogoutButtonData, LogoutButtonProps } from '@/app/layout-ui/types';
import layoutData from '@/app/layout-ui/layoutData.json';
import { useMobileBarStore } from '@/store/mobileBarStore';
import { toast } from 'sonner';

export function LogoutButton({
  authUser,
  showTooltip,
  setShowTooltip,
}: LogoutButtonProps) {
  const typedAuthButton: LogoutButtonData = layoutData.logoutButton;
  const router = useRouter();
  const { isMobile } = useDeviceStore();
  const isAuthenticated = authUser.role !== 'guest';
  const { open, close } = useMobileBarStore();

  const handleLogout = async () => {
    if (!isAuthenticated) return;
    try {
      await api.get('/api/auth/logout');
      router.refresh();
      if (open) close();
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
              className={`hover:scale-105 active:scale-105 touch-manipulation cursor-pointer`}
              onClick={handleLogout}
            >
              <DoorOpen className="!w-7 !h-7" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="select-none" side="bottom">
            <span>{typedAuthButton.tooltipContent}</span>
          </TooltipContent>
        </Tooltip>
      )}
    </>
  );
}
