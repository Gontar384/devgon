import React from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  LayoutGrid,
  Rocket,
  Zap,
} from 'lucide-react';
import { MediaType } from '@/cms/content/content-types';
import { ScrollRevealImage } from '@/app/home/ui/parts/animations/ScrollRevealImage';
import {
  HomeProblemSectionProps,
  ProblemIcon,
  ProblemItem,
} from '@/app/home/home-types';
import { AnimateItem } from '@/app/home/ui/parts/animations/AnimateItem';
import { HeroButton } from '@/app/home/ui/parts/HeroButton';

const ICONS: Record<ProblemIcon, React.ReactNode> = {
  clock: <Clock size={15} />,
  chaos: <LayoutGrid size={15} />,
  rocket: <Rocket size={15} />,
  zap: <Zap size={15} />,
};

export function HomeProblemsSection({ content }: HomeProblemSectionProps) {
  const safeData = {
    title: content.title ?? '',
    subtitle: content.subtitle ?? '',
    photoUrl: content.media?.[0]?.url ?? '',
    photoAlt: content.media?.[0]?.alt ?? '',
    mediaType: content.media?.[0]?.type ?? MediaType.IMAGE,
    problems: (content.customData?.problems as ProblemItem[] | undefined) ?? [],
    cta: content.customData?.cta ?? { label: '', href: '' },
    badge: content.customData?.badge ?? '',
    topHeader: content.customData?.topHeader ?? '',
  };

  return (
    <section id="solutions" className="w-full border-t">
      <div className="max-w-[1500px] mx-auto px-4 md:px-10 py-16 md:py-24 select-none">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_480px] gap-10 xl:gap-16 items-start">
          {safeData.photoUrl && (
            <ScrollRevealImage
              src={safeData.photoUrl}
              alt={safeData.photoAlt}
              type={safeData.mediaType}
              badge={{
                title: safeData.badge.label1,
                subtitle: safeData.badge.label2,
              }}
            />
          )}
          <div className="flex flex-col gap-6 lg:order-first">
            <AnimateItem>
              <div className="flex flex-col gap-2.5">
                <span className="text-[18px] md:text-[20px] uppercase tracking-[0.18em] text-primary font-semibold">
                  {safeData.topHeader}
                </span>
                {safeData.title && (
                  <h2
                    className="text-[35px] md:text-[40px] leading-tight tracking-tight"
                    dangerouslySetInnerHTML={{ __html: safeData.title }}
                  />
                )}
                {safeData.subtitle && (
                  <h3
                    className="text-[16px] md:text-[17px] text-muted-foreground leading-relaxed max-w-lg"
                    dangerouslySetInnerHTML={{ __html: safeData.subtitle }}
                  />
                )}
              </div>
            </AnimateItem>
            <div className="flex flex-col gap-3">
              {safeData.problems.map((item, index) => (
                <AnimateItem key={'problem-id' + index} delay={0.1}>
                  <div className="flex flex-col gap-0 rounded-2xl border bg-background overflow-hidden transition duration-300 hover:shadow-md hover:scale-101 active:scale-101">
                    <div className="flex items-center gap-2 px-4 pt-2 pb-2 border-b">
                      <span className="flex items-center justify-center w-9 h-9 rounded-md bg-primary/10 text-primary">
                        {ICONS[item.icon]}
                      </span>
                      <span className="text-[12px] md:text-[14px] uppercase tracking-[0.16em] font-semibold text-primary">
                        {item.tag}
                      </span>
                    </div>
                    <div className="flex flex-col gap-4 px-5 py-5">
                      <div className="flex items-start gap-3">
                        <span className="mt-[6px] shrink-0 w-[5px] h-[5px] rounded-full bg-muted-foreground/40" />
                        <p className="text-[15px] md:text-[16px] text-muted-foreground leading-relaxed">
                          {item.problem}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 pl-[18px]">
                        <div className="h-px w-5 bg-border" />
                        <ArrowRight
                          size={12}
                          className="text-primary shrink-0"
                        />
                        <div className="h-px flex-1 bg-border" />
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2
                          size={17}
                          className="mt-[3px] shrink-0 text-primary"
                        />
                        <p className="text-[15px] md:text-[16px] leading-relaxed">
                          {item.solution}
                        </p>
                      </div>
                    </div>
                  </div>
                </AnimateItem>
              ))}
            </div>
            {safeData.cta.label && (
              <AnimateItem delay={0.1}>
                <HeroButton
                  href={safeData.cta.href}
                  label={safeData.cta.label}
                  primary
                  icon={<ArrowRight size={20} />}
                />
              </AnimateItem>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
