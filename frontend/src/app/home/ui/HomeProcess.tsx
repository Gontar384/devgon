import { HomeProcessProps } from '@/app/home/home-types';
import { ProcessTimeline } from '@/app/home/ui/ProcessTimeline';
import { AnimateItem } from '@/app/home/ui/parts/animations/AnimateItem';

export function HomeProcess({ content }: HomeProcessProps) {
  if (!content) return null;

  const safeData = {
    title: content.title ?? '',
    subtitle: content.subtitle ?? '',
    topHeader: content.customData?.topHeader ?? '',
    items: content.customData?.items ?? [],
  };

  return (
    <section
      id="collaboration"
      className="relative pt-24 pb-24 lg:pb-36 overflow-hidden select-none"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-muted/30" />
        <div className="absolute left-1/2 -translate-x-1/2 w-[1400px] h-[400px] bg-primary/10 blur-3xl rounded-full" />
      </div>
      <div className="max-w-[1400px] mx-auto px-12">
        <AnimateItem>
          <div className="mb-16 max-w-2xl">
            <div className="flex flex-col gap-3">
              {safeData.topHeader && (
                <span className="text-[18px] md:text-[20px] font-semibold tracking-[0.2em] uppercase text-primary">
                  {safeData.topHeader}
                </span>
              )}
              {safeData.title && (
                <h2
                  className="text-4xl md:text-5xl font-bold leading-tight tracking-tight"
                  dangerouslySetInnerHTML={{ __html: safeData.title }}
                />
              )}
            </div>
            {safeData.subtitle && (
              <div
                className="text-muted-foreground mt-4 text-base md:text-lg leading-relaxed border-l-2 border-primary/30 pl-4"
                dangerouslySetInnerHTML={{ __html: safeData.subtitle }}
              />
            )}
          </div>
        </AnimateItem>
        <ProcessTimeline items={safeData.items} />
      </div>
    </section>
  );
}
