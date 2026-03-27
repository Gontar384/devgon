import React from 'react';
import { PrivacyPolicyManagerProps } from '@/app/privacy-policy/privacy-policy-types';
import {
  ContentOrFallback,
  FallbackContent,
} from '@/cms/content/content-types';
import { PrivacyPolicy } from '@/app/privacy-policy/ui/PrivacyPolicy';
import privacyPolicyInfoJson from '@/app/privacy-policy/fallbacks/privacy-policy-info-fallback.json';
import privacyPolicySectionsJson from '@/app/privacy-policy/fallbacks/privacy-policy-sections-fallback.json';

const privacyPolicyInfoFallback = privacyPolicyInfoJson as FallbackContent;
const privacyPolicySectionsFallback =
  privacyPolicySectionsJson as FallbackContent[];

export function PrivacyPolicyManager({ contents }: PrivacyPolicyManagerProps) {
  const infoCMS = contents['privacy-policy-info']?.[0];
  const info: ContentOrFallback = infoCMS ? infoCMS : privacyPolicyInfoFallback;

  const sectionsCMS = contents['privacy-policy-sections'] ?? [];
  const sections: ContentOrFallback[] = [
    ...sectionsCMS,
    ...privacyPolicySectionsFallback.slice(sectionsCMS.length),
  ];

  return <PrivacyPolicy info={info} sections={sections} />;
}
