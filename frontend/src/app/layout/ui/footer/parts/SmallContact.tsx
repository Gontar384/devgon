'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import { Mail, Phone } from 'lucide-react';
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_PHONE_FORMATTED,
} from '@/lib/contact';

export function SmallContact() {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="flex flex-col gap-2 text-sm font-semibold">
      <div className="text-muted-foreground">Kontakt</div>
      <Link
        href={`mailto:${CONTACT_EMAIL}`}
        className="flex items-center gap-2 hover:text-primary active:text-primary transition-colors"
      >
        <Mail size={14} />
        {CONTACT_EMAIL}
      </Link>
      {revealed ? (
        <Link
          href={`tel:${CONTACT_PHONE}`}
          className="flex items-center gap-2 hover:text-primary active:text-primary transition-colors"
        >
          <Phone size={14} />
          {CONTACT_PHONE_FORMATTED}
        </Link>
      ) : (
        <button
          onClick={() => setRevealed(true)}
          className="flex items-center gap-2 hover:text-primary active:text-primary transition-colors cursor-pointer"
        >
          <Phone size={14} />
          Pokaż numer
        </button>
      )}
    </div>
  );
}
