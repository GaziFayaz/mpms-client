'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/hooks/use-auth';

export default function RootPage() {
  const router = useRouter();
  const { isAuthenticated, user, _hasHydrated } = useAuthStore();

  useEffect(() => {
    if (!_hasHydrated) return;
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }
    if (user?.role === 'admin' || user?.role === 'manager') {
      router.replace('/dashboard');
    } else {
      router.replace('/user');
    }
  }, [_hasHydrated, isAuthenticated, user, router]);

  return null;
}
