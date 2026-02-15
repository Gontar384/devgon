import React from 'react';

export function AuthButtonWrapper({ children }: { children: React.ReactNode }) {
  return <div className="md:flex mr-5 w-[250px] justify-end">{children}</div>;
}
