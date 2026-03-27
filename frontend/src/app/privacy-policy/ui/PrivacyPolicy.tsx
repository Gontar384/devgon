import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PrivacyPolicySection } from '@/app/privacy-policy/ui/PrivacyPolicySection';
import { PrivacyPolicyProps } from '@/app/privacy-policy/privacy-policy-types';

export function PrivacyPolicy({ info, sections }: PrivacyPolicyProps) {
  const safeData = {
    title: info?.title ?? '',
    subtitle: info?.subtitle ?? '',
    updatedAt: info?.customData?.updatedAt ?? null,
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <div className="mb-10">
        {safeData.title && (
          <h1
            className="text-4xl md:text-5xl font-bold tracking-tight"
            dangerouslySetInnerHTML={{ __html: safeData.title }}
          />
        )}
        {safeData.subtitle && (
          <div
            className="mt-4 text-muted-foreground text-base leading-relaxed"
            dangerouslySetInnerHTML={{ __html: safeData.subtitle }}
          />
        )}
      </div>
      <Card className="bg-white">
        <CardContent className="py-8 px-6 md:px-10">
          <ol className="flex flex-col divide-y divide-border">
            {sections.map((section, index) => (
              <PrivacyPolicySection
                key={'id' in section ? section.id : `fallback-pp-${index}`}
                index={index + 1}
                content={section}
              />
            ))}
          </ol>
        </CardContent>
      </Card>
      {safeData.updatedAt && (
        <div
          className="mt-8 text-xs text-muted-foreground text-center"
          dangerouslySetInnerHTML={{ __html: safeData.updatedAt }}
        />
      )}
    </main>
  );
}
