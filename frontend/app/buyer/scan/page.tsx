'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BuyerScanRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/verify');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#ffffff] flex items-center justify-center text-xs text-[#8d8d8d]">
      Redirecting to Public Verification Gateway...
    </div>
  );
}