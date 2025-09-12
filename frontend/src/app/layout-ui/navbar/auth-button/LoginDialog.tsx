'use client';

import * as React from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoginDialogData, LoginDialogProps } from '@/app/layout-ui/types';
import { loginDialog } from '@/app/layout-ui/layoutData.json';
import Image from 'next/image';

export function LoginDialog({ open, setOpen }: LoginDialogProps) {
  const typedLoginDialogData: LoginDialogData = loginDialog;
  const handleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/oauth`;
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="max-w-md rounded-[1.2rem] select-none">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-3xl">
            {typedLoginDialogData.dialogTitle}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {typedLoginDialogData.dialogDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Card className="shadow-none bg-background">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              {typedLoginDialogData.cardTitle}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              className="w-full flex items-center cursor-pointer hover:scale-105 active:scale-105 hover:bg-primary"
              onClick={handleLogin}
            >
              <Image
                src={typedLoginDialogData.imageSrc}
                alt={typedLoginDialogData.imageAlt}
                width={typedLoginDialogData.imageW}
                height={typedLoginDialogData.imageH}
                priority
              />
              {typedLoginDialogData.loginButton}
            </Button>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              variant="secondary"
              className="cursor-pointer text-primary-foreground hover:scale-105 active:scale-105 hover:bg-secondary"
              onClick={() => setOpen(false)}
            >
              {typedLoginDialogData.cancelButton}
            </Button>
          </CardFooter>
        </Card>
      </AlertDialogContent>
    </AlertDialog>
  );
}
