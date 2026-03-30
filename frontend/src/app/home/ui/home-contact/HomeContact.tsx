import React from 'react';
import { AnimateItem } from '@/app/home/ui/home-hero/parts/AnimateItem';
import { HomeContactForm } from '@/app/home/ui/home-contact/HomeContactForm';
import Link from 'next/link';
import { RevealPhone } from '@/app/home/ui/home-contact/parts/RevealPhone';
import { Mail, MessageSquare } from 'lucide-react';
import { HomeContactProps } from '@/app/home/home-types';

export function HomeContact({ content }: HomeContactProps) {
  const safeData = {
    title: content?.title ?? '',
    subtitle: content?.subtitle ?? '',
    description: content?.description ?? '',
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative pb-28 pt-12 overflow-hidden select-none"
    >
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-muted/30" />
        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[700px] h-[500px] bg-primary/15 blur-3xl rounded-full" />
        <div className="absolute left-1/4 bottom-0 w-[400px] h-[300px] bg-primary/8 blur-3xl rounded-full" />
      </div>
      <div className="max-w-[1200px] mx-auto px-6">
        <AnimateItem>
          <div className="text-center mb-16">
            <div
              className="inline-flex items-center gap-2 text-primary font-medium text-sm mb-5 border border-primary/30 rounded-full px-5 py-2 bg-primary/5"
              aria-hidden="true"
            >
              <MessageSquare className="w-4 h-4" />
              Kontakt
            </div>
            {safeData.title && (
              <h2
                id="contact-heading"
                className="text-5xl md:text-7xl font-semibold leading-tight"
                dangerouslySetInnerHTML={{ __html: safeData.title }}
              />
            )}
            {safeData.subtitle && (
              <div
                className="text-muted-foreground mt-5 text-xl md:text-2xl max-w-xl mx-auto"
                dangerouslySetInnerHTML={{ __html: safeData.subtitle }}
              />
            )}
          </div>
        </AnimateItem>
        <div className="grid lg:grid-cols-[1fr_2fr] gap-6 items-start max-w-[1060px] mx-auto">
          <div className="flex flex-col gap-5">
            <AnimateItem delay={0.1}>
              <div className="bg-background/70 backdrop-blur-sm border border-border rounded-2xl p-8 flex flex-col gap-2 hover:border-primary/40 active:border-primary/40 transition-colors duration-300">
                <div className="flex items-center gap-2.5 text-primary mb-1">
                  <Mail className="w-5 h-5" aria-hidden="true" />
                  <p className="text-base font-medium">Email</p>
                </div>
                <Link
                  href="mailto:devgonteam@gmail.com"
                  className="text-lg font-semibold hover:text-primary active:text-primary transition-colors break-all"
                >
                  devgonteam@gmail.com
                </Link>
              </div>
            </AnimateItem>
            <AnimateItem delay={0.15}>
              <div className="bg-background/70 backdrop-blur-sm border border-border rounded-2xl p-8 hover:border-primary/40 active:border-primary/40 transition-colors duration-300">
                <RevealPhone />
              </div>
            </AnimateItem>
            {safeData.description && (
              <AnimateItem delay={0.2}>
                <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6">
                  <div
                    className="text-base text-muted-foreground leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: safeData.description }}
                  />
                </div>
              </AnimateItem>
            )}
          </div>
          <AnimateItem delay={0.1}>
            <div className="bg-background/70 backdrop-blur-sm border border-border rounded-2xl p-9 md:p-12 hover:border-primary/30 active:border-primary/30 transition-colors duration-300">
              <HomeContactForm />
            </div>
          </AnimateItem>
        </div>
      </div>
    </section>
  );
}
