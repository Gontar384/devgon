import Image from 'next/image';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="ml-4">
      <Image
        src="/logo_caption_final.svg"
        alt="Logo devgon"
        width={85}
        height={64}
        priority
      />
    </Link>
  );
}
