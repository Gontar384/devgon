import { createMetadata } from '@/lib/metadata/metadata';
import { Metadata } from 'next';
import { loadPageContents } from '@/cms/content/util/service/loadPageContents';
import { PrivacyPolicyManager } from '@/app/privacy-policy/PrivacyPolicyManager';

export const generateMetadata = (): Metadata =>
  createMetadata({
    title: 'Polityka Prywatności – devgon',
    description:
      'Dowiedz się, jak przetwarzamy Twoje dane osobowe. Polityka prywatności serwisu devgon.pl zgodna z RODO.',
    path: '/polityka-prywatnosci',
  });

export default async function PrivacyPolicyPage() {
  const { contents } = await loadPageContents([
    'privacy-policy-info',
    'privacy-policy-sections',
  ]);

  return <PrivacyPolicyManager contents={contents} />;
}
