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
          <div className="flex flex-wrap justify-evenly items-center pt-6 pb-10 gap-10">
            <ShortCompanyNote />
            <SocialLinks />
            <SmallMenu />
            <SmallContact />
          </div>
          <div className="border" />
          <div className="flex flex-wrap justify-between items-center mt-5 mx-2 gap-10">
            <AllRightsReserved />
            <OtherLinks />
          </div>
        </CardContent>
      </Card>
      <DevgonWatermark />
    </footer>
  );
}
