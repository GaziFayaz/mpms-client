'use client';

import { Menu, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import Link from 'next/link';

export function Header() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
      <Sheet>
        <SheetTrigger render={<Button variant="outline" size="icon" className="shrink-0 lg:hidden" />}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <nav className="grid gap-2 text-lg font-medium mt-4">
            <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold mb-2">
              <span className="h-6 w-6 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">P</span>
              <span>PMS</span>
            </Link>
            <Link href="/dashboard" className="hover:text-primary">Overview</Link>
            <Link href="/dashboard/projects" className="hover:text-primary">Projects</Link>
            <Link href="/dashboard/tasks" className="hover:text-primary">Tasks</Link>
            <Link href="/dashboard/team" className="hover:text-primary">Team</Link>
            <Link href="/dashboard/reports" className="hover:text-primary">Reports</Link>
          </nav>
        </SheetContent>
      </Sheet>
      
      <div className="w-full flex-1">
        {/* Can add search here if needed */}
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="secondary" size="icon" className="rounded-full" />}>
          <UserCircle className="h-5 w-5" />
          <span className="sr-only">Toggle user menu</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuLabel>
              {user?.name || 'My Account'}
              <div className="text-xs text-muted-foreground font-normal">{user?.email}</div>
            </DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
