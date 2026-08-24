'use client';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { UserStar } from 'lucide-react';
import React from 'react';
import { useDeviceStore } from '@/store/deviceStore';
import { NavLink } from '@/app/layout/util/NavLink';

export function AdminButton() {
  const { isMobile } = useDeviceStore();

  const trigger = (
    <NavLink
      href="/admin"
      className="hover:scale-105 active:scale-105 cursor-pointer flex items-center justify-center px-0.5"
      aria-label="Go to the admin panel"
    >
      <UserStar className="!w-7 !h-7" aria-hidden="true" />
    </NavLink>
  );

  if (isMobile) return trigger;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{trigger}</TooltipTrigger>
      <TooltipContent className="select-none" side="bottom">
        <span>Panel administratora</span>
      </TooltipContent>
    </Tooltip>
  );
}
