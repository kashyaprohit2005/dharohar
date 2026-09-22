'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PassbookRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/artisan/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#ffffff] flex items-center justify-center text-xs text-[#8d8d8d]">
      Redirecting to Artisan Living Passport & Passbook...
    </div>
  );
}
