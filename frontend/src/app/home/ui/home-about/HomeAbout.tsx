import { HomeAboutProps } from '@/app/home/home-types';
import { MediaType } from '@/cms/content/content-types';
import { AnimateItem } from '@/app/home/ui/home-hero/parts/AnimateItem';
import { CursorGlow } from '@/app/home/ui/home-intro/parts/CursorGlow';
import { MediaContainer } from '@/app/home/ui/home-about/parts/MediaContainer';
import { Cookie } from 'next/font/google';

const cookie = Cookie({
  subsets: ['latin'],
  weight: ['400'],
});

export function HomeAbout({ content }: HomeAboutProps) {
  if (!content) return null;

  const safeData = {
    title: content.title ?? '',
    subtitle: content.subtitle ?? '',
    description: content.description ?? '',
    photoUrl: content.media?.[0]?.url ?? '',
    photoAlt: content.media?.[0]?.alt ?? '',
    mediaType: content.media?.[0]?.type ?? MediaType.IMAGE,
    signature: content.customData?.signature ?? '',
    signatureRole: content.customData?.signatureRole ?? '',
  };

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative py-24 overflow-hidden select-none"
    >
      <div className="max-w-[1200px] mx-auto px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <AnimateItem>
            <div className="relative">
              {safeData.title && (
                <h2
                  id="about-heading"
                  className="text-5xl md:text-6xl font-semibold leading-tight"
                  dangerouslySetInnerHTML={{ __html: safeData.title }}
                />
              )}
              {safeData.subtitle && (
                <div
                  className="text-xl md:text-2xl text-primary"
                  dangerouslySetInnerHTML={{ __html: safeData.subtitle }}
                />
              )}
              {safeData.description && (
                <div
                  className="text-base md:text-lg mt-5 text-muted-foreground whitespace-pre-line"
                  dangerouslySetInnerHTML={{ __html: safeData.description }}
                />
              )}
              {safeData.signature && (
                <div className="flex flex-col items-end gap-0.5">
                  {safeData.signatureRole && (
                    <span className="text-[10px] uppercase tracking-[0.25em] text-foreground/60">
                      {safeData.signatureRole}
                    </span>
                  )}
                  <span
                    className={`${cookie.className} text-6xl md:text-7xl leading-none`}
                  >
                    {safeData.signature}
                  </span>
                </div>
              )}
            </div>
          </AnimateItem>
          {safeData.photoUrl && (
            <AnimateItem className="w-full flex justify-center">
              <MediaContainer
                src={safeData.photoUrl}
                alt={safeData.photoAlt}
                type={safeData.mediaType}
              />
            </AnimateItem>
          )}
        </div>
      </div>
      <CursorGlow cursorColor="primary" />
    </section>
  );
}
