import { Card, CardContent } from '@/components/ui/card';
import React from 'react';
import { ShortCompanyNote } from '@/app/layout/ui/footer/parts/ShortCompanyNote';
import { DevgonWatermark } from '@/app/layout/ui/footer/parts/DevgonWatermark';
import { SocialLinks } from '@/app/layout/ui/footer/parts/SocialLinks';
import { SmallMenu } from '@/app/layout/ui/footer/parts/SmallMenu';
import { OtherLinks } from '@/app/layout/ui/footer/parts/OtherLinks';
import { AllRightsReserved } from '@/app/layout/ui/footer/parts/AllRightsReserved';
import { SmallContact } from '@/app/layout/ui/footer/parts/SmallContact';

export function Footer() {
  return (
    <footer className="px-2 select-none mt-24" aria-label="Stopka strony">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-[1.6fr_1fr] lg:grid-cols-[1.6fr_1fr_1fr_1fr] px-4 pt-4 pb-8 gap-12">
            <ShortCompanyNote />
            <SmallMenu />
            <SmallContact />
            <SocialLinks />
          </div>
          <div className="border" />
          <div className="flex flex-wrap justify-between items-center px-4 pt-5 gap-12">
            <AllRightsReserved />
            <OtherLinks />
          </div>
        </CardContent>
      </Card>
      <DevgonWatermark />
    </footer>
  );
}
