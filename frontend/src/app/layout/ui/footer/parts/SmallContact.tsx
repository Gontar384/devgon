import Link from 'next/link';
import React from 'react';
import { Mail, Phone } from 'lucide-react';

const PARTS = ['+48', '517', '988', '760'];

export function SmallContact() {
  return (
    <div className="flex flex-col gap-2">
      <Link
        href="mailto:devgonteam@gmail.com"
        className="flex items-center gap-2 text-sm font-semibold hover:text-primary active:text-primary transition-colors break-all"
      >
        <Mail size={14} />
        devgonteam@gmail.com
      </Link>
      <Link
        href={`tel:${PARTS.join('')}`}
        className="flex items-center gap-2 text-sm font-semibold hover:text-primary active:text-primary transition-colors break-all"
      >
        <Phone size={14} />
        <span className="flex gap-1">
          {PARTS.map((part, i) => (
            <span key={i}>{part}</span>
          ))}
        </span>
      </Link>
    </div>
  );
}
