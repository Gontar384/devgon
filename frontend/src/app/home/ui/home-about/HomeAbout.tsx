import { HomeAboutProps } from '@/app/home/home-types';
import { MediaType } from '@/cms/content/content-types';
import { AnimateItem } from '@/app/home/ui/home-hero/parts/AnimateItem';
import { CursorGlow } from '@/app/home/ui/home-intro/parts/CursorGlow';
import { MediaContainer } from '@/app/home/ui/home-about/parts/MediaContainer';

export function HomeAbout({ content }: HomeAboutProps) {
  if (!content) return null;

  const safeData = {
    title: content.title ?? '',
    subtitle: content.subtitle ?? '',
    description: content.description ?? '',
    photoUrl: content.media?.[0]?.url ?? '',
    photoAlt: content.media?.[0]?.alt ?? '',
    mediaType: content.media?.[0]?.type ?? MediaType.IMAGE,
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
                  className="text-base md:text-lg mt-5 text-muted-foreground space-y-4"
                  dangerouslySetInnerHTML={{ __html: safeData.description }}
                />
              )}
            </div>
          </AnimateItem>
          {safeData.photoUrl && (
            <div className="w-full flex justify-center">
              <AnimateItem>
                <MediaContainer
                  src={safeData.photoUrl}
                  alt={safeData.photoAlt}
                  type={safeData.mediaType}
                />
              </AnimateItem>
            </div>
          )}
        </div>
      </div>
      <CursorGlow cursorColor="primary" />
    </section>
  );
}
