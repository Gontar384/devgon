import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { UserStar } from 'lucide-react';
import React from 'react';
import Link from 'next/link';

export function AdminButton() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href="/admin"
          className="hover:scale-105 active:scale-105 cursor-pointer flex items-center justify-center"
        >
          <UserStar className="!w-7 !h-7" />
        </Link>
      </TooltipTrigger>
      <TooltipContent className="select-none" side="bottom">
        <span>Panel administratora</span>
      </TooltipContent>
    </Tooltip>
  );
}
