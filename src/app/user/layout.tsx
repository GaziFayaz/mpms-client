'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/header';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { LayoutDashboard, Folder, CheckSquare } from 'lucide-react';

const routes = [
  { href: '/user', label: 'My Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/user/projects', label: 'Projects', icon: Folder },
  { href: '/user/tasks', label: 'Tasks', icon: CheckSquare },
];

export function UserSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-background lg:flex">
      <div className="flex h-14 items-center border-b px-6">
        <Link href="/user" className="flex items-center gap-2 font-semibold">
          <span className="h-6 w-6 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">P</span>
          <span>PMS</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-4 text-sm font-medium">
          {routes.map((route) => {
            const isActive = route.exact 
              ? pathname === route.href 
              : pathname.startsWith(route.href);

            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary',
                  isActive ? 'bg-muted text-primary' : 'text-muted-foreground'
                )}
              >
                <route.icon className="h-4 w-4" />
                {route.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (useAuthStore.persist.hasHydrated()) {
      setHydrated(true);
    } else {
      const unsub = useAuthStore.persist.onFinishHydration(() => {
        setHydrated(true);
      });
      return unsub;
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }
    if (user?.role !== 'member' && user?.role !== 'manager') {
      router.replace('/dashboard');
    }
  }, [hydrated, isAuthenticated, user, router]);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated || (user?.role !== 'member' && user?.role !== 'manager')) {
    return null;
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <UserSidebar />
      <div className="flex flex-col lg:pl-64 flex-1">
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
