import { createMetadata } from '@/lib/metadata/metadata';
import { Metadata } from 'next';
import { loadPageContents } from '@/cms/content/util/service/loadPageContents';
import { PrivacyPolicyManager } from '@/app/privacy-policy/PrivacyPolicyManager';

export const generateMetadata = (): Metadata =>
  createMetadata({
    title: 'Privacy policy — Jakub Gontarek',
    description:
      'How personal data submitted through this website is processed, in line with GDPR.',
    path: '/privacy-policy',
  });

export default async function PrivacyPolicyPage() {
  const { contents } = await loadPageContents([
    'privacy-policy-info',
    'privacy-policy-sections',
  ]);

  return <PrivacyPolicyManager contents={contents} />;
}
