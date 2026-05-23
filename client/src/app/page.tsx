'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/hooks/use-auth';

export default function RootPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    if (user?.role === 'admin' || user?.role === 'manager') {
      router.replace('/dashboard');
    } else {
      router.replace('/user');
    }
  }, [isAuthenticated, user, router]);

  return null; // Empty placeholder while redirecting
}
