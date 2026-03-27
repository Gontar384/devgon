import React from 'react';
import { PrivacyPolicySectionProps } from '@/app/privacy-policy/privacy-policy-types';

export function PrivacyPolicySection({
  index,
  content,
}: PrivacyPolicySectionProps) {
  const safeData = {
    title: content?.title ?? '',
    description: content?.description ?? '',
    items:
      (content as { customData?: { items?: string[] } })?.customData?.items ??
      [],
  };

  return (
    <li className="flex gap-5 py-8 first:pt-0 last:pb-0">
      <div className="flex-shrink-0 mt-0.5">
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold select-none">
          {index}
        </span>
      </div>
      <div className="flex flex-col gap-2 flex-1 min-w-0">
        {}
        {safeData.title && (
          <h2
            className="text-base font-semibold leading-snug"
            dangerouslySetInnerHTML={{ __html: safeData.title }}
          />
        )}
        {safeData.description && (
          <div
            className="text-sm text-muted-foreground leading-relaxed"
            dangerouslySetInnerHTML={{ __html: safeData.description }}
          />
        )}
        {safeData.items && safeData.items.length > 0 && (
          <ul className="mt-1 flex flex-col gap-1.5">
            {safeData.items.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <span className="mt-2 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary/50" />
                <span dangerouslySetInnerHTML={{ __html: item }} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </li>
  );
}
