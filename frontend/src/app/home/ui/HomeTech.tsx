import { MediaType } from '@/cms/content/content-types';
import { HomeTechProps } from '@/app/home/home-types';
import { TechMarquee } from '@/app/home/ui/parts/TechMarquee';
import { AnimateItem } from '@/app/home/ui/parts/animations/AnimateItem';

export function HomeTech({ content }: HomeTechProps) {
  if (!content) return null;

  const safeData = {
    title: content.title ?? '',
    subtitle: content.subtitle ?? '',
    logos:
      content.media
        ?.filter((item) => item?.url)
        .map((item) => ({
          src: item.url!,
          alt: item.alt ?? '',
          type: item.type ?? MediaType.IMAGE,
        })) ?? [],
  };

  return (
    <section className="relative w-full py-10 md:py-20 overflow-hidden select-none bg-muted/60">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute inset-y-0 left-0 w-8 md:w-24 pointer-events-none bg-gradient-to-r from-muted to-transparent z-20" />
      <div className="absolute inset-y-0 right-0 w-8 md:w-24 pointer-events-none bg-gradient-to-l from-muted to-transparent z-20" />
      <AnimateItem>
        <div className="relative max-w-[1400px] mx-auto px-6 text-center mb-14">
          {safeData.title && (
            <h2
              className="text-3xl md:text-4xl font-semibold tracking-tight"
              dangerouslySetInnerHTML={{ __html: safeData.title }}
            />
          )}
          {safeData.subtitle && (
            <div
              className="text-muted-foreground mt-3 text-sm md:text-base"
              dangerouslySetInnerHTML={{ __html: safeData.subtitle }}
            />
          )}
        </div>
      </AnimateItem>
      <AnimateItem delay={0.1}>
        <div className="relative">
          <TechMarquee logos={safeData.logos} />
        </div>
      </AnimateItem>
    </section>
  );
}
