import { LoginButtonInterface } from '@/app/layout-ui/navbar/types';
import React from 'react';
import { LoginButton } from '@/app/layout-ui/navbar/parts/LoginButton';

export const LoginButtonWrapper: React.FC<LoginButtonInterface> = ({
  isMobileBar,
}) => {
  return (
    <div
      className={`${isMobileBar ? 'flex flex-col gap-3 mt-8' : 'hidden md:flex mr-4'}`}
      aria-label="Akcje użytkownika"
    >
      <button className="sr-only">
        Zaloguj się za pomocą Google, aby odblokować pełne możliwości naszej
        strony
      </button>
      <LoginButton isMobileBar={isMobileBar} />
    </div>
  );
};
