'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useTeam } from '@/hooks/use-team';
import { Search, UserPlus } from 'lucide-react';

function roleBadgeVariant(role: string): 'default' | 'secondary' | 'outline' {
  if (role === 'admin') return 'default';
  if (role === 'manager') return 'secondary';
  return 'outline';
}

export default function TeamPage() {
  const { data: members, isLoading } = useTeam();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team</h1>
          <p className="text-muted-foreground">Manage your team members.</p>
        </div>
        <Button render={<Link href="/dashboard/team/create" />} nativeButton={false}>
          <UserPlus className="mr-2 h-4 w-4" />Add Member
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input type="search" placeholder="Search by name or email..." className="pl-8" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="flex items-center gap-4 p-4">
              <Skeleton className="size-12 rounded-full" />
              <div className="flex-1"><Skeleton className="h-4 w-24 mb-1" /><Skeleton className="h-3 w-32" /></div>
            </Card>
          ))
        ) : (
          members?.map((member) => (
            <Card key={member.id} className="flex items-center gap-4 p-4">
              <Avatar className="size-12">
                <AvatarFallback>{member.name.split(' ').map((n) => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{member.name}</p>
                <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={roleBadgeVariant(member.role)}>{member.role}</Badge>
                  {member.department && (
                    <span className="text-xs text-muted-foreground">{member.department}</span>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
