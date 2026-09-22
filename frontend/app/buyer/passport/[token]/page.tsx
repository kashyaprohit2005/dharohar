'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function BuyerPassportRedirect() {
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const token = params?.token;
    if (token) {
      router.replace(`/verify/${token}`);
    } else {
      router.replace('/verify');
    }
  }, [params, router]);

  return (
    <div className="min-h-screen bg-[#ffffff] flex items-center justify-center text-xs text-[#8d8d8d]">
      Redirecting to Living Heritage Passport...
    </div>
  );
}
