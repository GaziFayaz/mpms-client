'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, Plus, MoreHorizontal, UserPlus } from 'lucide-react';

const mockTeam = [
  { id: '1', name: 'Alice Chen', email: 'alice@example.com', role: 'Designer', department: 'Design' },
  { id: '2', name: 'Bob Lee', email: 'bob@example.com', role: 'Developer', department: 'Engineering' },
  { id: '3', name: 'Carol Wu', email: 'carol@example.com', role: 'Manager', department: 'Product' },
  { id: '4', name: 'Dave Kim', email: 'dave@example.com', role: 'Developer', department: 'Engineering' },
  { id: '5', name: 'Eve Park', email: 'eve@example.com', role: 'QA', department: 'Engineering' },
];

function roleBadgeVariant(role: string): 'default' | 'secondary' | 'outline' {
  if (role === 'Manager') return 'default';
  if (role === 'Developer' || role === 'Designer') return 'secondary';
  return 'outline';
}

export default function TeamPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team</h1>
          <p className="text-muted-foreground">Manage your team members.</p>
        </div>
        <Button render={<Link href="/dashboard/team/create" />} nativeButton={false}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Member
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input type="search" placeholder="Search by name or email..." className="pl-8" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockTeam.map(member => (
          <Card key={member.id} className="flex items-center gap-4 p-4">
            <Avatar className="size-12">
              <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{member.name}</p>
              <p className="text-xs text-muted-foreground truncate">{member.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={roleBadgeVariant(member.role)}>{member.role}</Badge>
                <span className="text-xs text-muted-foreground">{member.department}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
