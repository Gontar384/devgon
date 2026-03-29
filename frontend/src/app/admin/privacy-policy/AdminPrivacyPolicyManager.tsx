import React from 'react';
import { AdminManagerProps } from '@/app/admin/admin-types';
import { ContentCardManager } from '@/cms/content/ui/ContentCardManager';
import { AdminContentErrorBanner } from '@/cms/content/ui/atomic/AdminContentErrorBanner';

export function AdminPrivacyPolicyManager({
  contents,
  error,
  failedKeys,
}: AdminManagerProps) {
  const privacyPolicyInfo = contents['privacy-policy-info'] ?? [];
  const privacyPolicySections = contents['privacy-policy-sections'] ?? [];

  return (
    <div className="flex flex-col items-center px-2">
      {error && <AdminContentErrorBanner failedKeys={failedKeys} />}
      <h1 className="sr-only">Polityka prywatności</h1>
      <div className="flex flex-col items-center gap-12 w-full mt-5">
        <ContentCardManager
          contents={privacyPolicyInfo}
          contentKey={'privacy-policy-info'}
          mode={'single'}
          fields={{
            title: 100,
            subtitle: 500,
            description: 0,
            customData: 300,
          }}
          maxMedia={0}
        />
        <ContentCardManager
          contents={privacyPolicySections}
          contentKey={'privacy-policy-sections'}
          mode={'multiple'}
          fields={{
            title: 100,
            subtitle: 0,
            description: 1000,
            customData: 1000,
          }}
          maxMedia={0}
        />
      </div>
    </div>
  );
}
