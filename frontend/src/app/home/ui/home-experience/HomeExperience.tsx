import React from 'react';
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Code2,
  GraduationCap,
} from 'lucide-react';
import { MediaType } from '@/cms/content/content-types';
import { ScrollRevealImage } from '@/app/home/ui/home-experience/parts/ScrollRevealImage';
import {
  HomeExperienceProps,
  ExperienceIcon,
  ExperienceItem,
} from '@/app/home/home-types';
import { AnimateItem } from '@/app/home/ui/home-hero/parts/AnimateItem';
import { NavigationButton } from '@/app/home/ui/home-hero/parts/NavigationButton';

const ICONS: Record<ExperienceIcon, React.ReactNode> = {
  briefcase: <Briefcase size={15} aria-hidden="true" />,
  code: <Code2 size={15} aria-hidden="true" />,
  graduation: <GraduationCap size={15} aria-hidden="true" />,
};

export function HomeExperience({ content }: HomeExperienceProps) {
  if (!content) return null;

  const safeData = {
    title: content.title ?? '',
    subtitle: content.subtitle ?? '',
    photoUrl: content.media?.[0]?.url ?? '',
    photoAlt: content.media?.[0]?.alt ?? '',
    mediaType: content.media?.[0]?.type ?? MediaType.IMAGE,
    roles: (content.customData?.roles as ExperienceItem[] | undefined) ?? [],
    cta: content.customData?.cta ?? { label: '', href: '' },
    badge: content.customData?.badge ?? '',
    topHeader: content.customData?.topHeader ?? '',
  };

  return (
    <section
      id="experience"
      aria-label={safeData.title || 'Experience'}
      className="w-full border-t"
    >
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
                {safeData.topHeader && (
                  <span className="text-[18px] md:text-[20px] uppercase tracking-[0.18em] text-primary font-semibold">
                    {safeData.topHeader}
                  </span>
                )}
                {safeData.title && (
                  <h2
                    className="text-[35px] md:text-[40px] leading-tight tracking-tight"
                    dangerouslySetInnerHTML={{ __html: safeData.title }}
                  />
                )}
                {safeData.subtitle && (
                  <div
                    className="text-[16px] md:text-[17px] text-muted-foreground leading-relaxed max-w-lg"
                    dangerouslySetInnerHTML={{ __html: safeData.subtitle }}
                  />
                )}
              </div>
            </AnimateItem>
            {safeData.roles.length > 0 && (
              <ul className="flex flex-col gap-3 list-none p-0 m-0">
                {safeData.roles.map((item, index) => (
                  <li key={'role-id' + index}>
                    <AnimateItem delay={0.1}>
                      <div className="flex flex-col gap-0 rounded-2xl border bg-background overflow-hidden transition duration-300 hover:shadow-md hover:scale-101 active:scale-101">
                        <div className="flex items-center gap-2 px-4 pt-2 pb-2 border-b">
                          <span
                            aria-hidden="true"
                            className="flex items-center justify-center w-9 h-9 rounded-md bg-primary/10 text-primary"
                          >
                            {ICONS[item.icon]}
                          </span>
                          <span className="text-[12px] md:text-[14px] uppercase tracking-[0.16em] font-semibold text-primary">
                            {item.period}
                          </span>
                        </div>
                        <div className="flex flex-col gap-4 px-5 py-5">
                          <div className="flex flex-col gap-0.5">
                            <h3 className="text-[17px] md:text-[19px] font-semibold leading-snug">
                              {item.role}
                            </h3>
                            {item.company && (
                              <p className="text-[14px] md:text-[15px] text-muted-foreground">
                                {item.company}
                              </p>
                            )}
                          </div>
                          {item.bullets?.length > 0 && (
                            <div className="flex flex-col gap-3">
                              {item.bullets.map((bullet, i) => (
                                <div key={i} className="flex items-start gap-3">
                                  <CheckCircle2
                                    size={17}
                                    aria-hidden="true"
                                    className="mt-[3px] shrink-0 text-primary"
                                  />
                                  <p className="text-[15px] md:text-[16px] leading-relaxed">
                                    {bullet}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </AnimateItem>
                  </li>
                ))}
              </ul>
            )}
            {safeData.cta.label && safeData.cta.href && (
              <AnimateItem delay={0.1}>
                <NavigationButton
                  href={safeData.cta.href}
                  label={safeData.cta.label}
                  primary
                  icon={<ArrowRight size={20} aria-hidden="true" />}
                  size="md"
                />
              </AnimateItem>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
