import { useNavigation } from '@/app/layout/util/useNavigation';
import Link from 'next/link';
import { NavLinkProps } from '@/app/layout/layout-types';

export function NavLink({ href, onNavigate, onClick, ...props }: NavLinkProps) {
  const { getLinkHandler } = useNavigation();

  const handleClick = getLinkHandler(href.toString(), onNavigate);

  return (
    <Link
      href={href}
      scroll={false}
      onClick={(e) => {
        onClick?.(e);
        handleClick(e);
      }}
      {...props}
    />
  );
}
