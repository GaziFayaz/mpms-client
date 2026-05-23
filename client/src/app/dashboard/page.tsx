'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Folder, CheckSquare, Clock, Users } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function DashboardOverview() {
  // Mock data for now
  const stats = [
    { title: 'Total Projects', value: '12', icon: Folder, desc: '+2 from last month' },
    { title: 'Active Sprints', value: '4', icon: Clock, desc: 'Across 3 projects' },
    { title: 'Tasks Pending', value: '45', icon: CheckSquare, desc: '12 high priority' },
    { title: 'Team Members', value: '8', icon: Users, desc: '2 pending invites' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
          <p className="text-muted-foreground">Here&apos;s what&apos;s happening in your projects today.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button render={<Link href="/dashboard/team" />} nativeButton={false} variant="outline">
            Manage Team
          </Button>
          <Button render={<Link href="/dashboard/projects/create" />} nativeButton={false}>
            Create Project
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity Placeholder */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Activity feed will be implemented here.</p>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Deadlines list will be implemented here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
