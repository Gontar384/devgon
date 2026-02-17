import { AdminContentErrorBannerProps } from '@/app/admin/admin-types';

export function AdminContentErrorBanner({
  failedKeys,
}: AdminContentErrorBannerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 fixed bottom-0 left-0 z-[999] w-full h-20 bg-yellow-200 p-2 text-black font-medium text-center">
      <p className="flex-shrink-0">⚠️ Nie załadowano niektórych treści:</p>
      <p className="overflow-y-auto w-full break-all px-4 text-sm">
        {failedKeys.join(', ')}
      </p>
    </div>
  );
}
