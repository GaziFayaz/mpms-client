'use client';

import Link from 'next/link';
import { useAuthStore } from '@/hooks/use-auth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckSquare, Clock, Folder, Activity } from 'lucide-react';

export default function UserDashboard() {
  const { user } = useAuthStore();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.name || 'User'}</h1>
        <p className="text-muted-foreground">Here&apos;s your work overview for today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Completed This Week</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">+2 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hours Logged This Week</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32h</div>
            <p className="text-xs text-muted-foreground">Across 3 projects</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Folder className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">4 tasks pending</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>My Tasks</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {[
              { id: '1', title: 'Design landing page', status: 'In Progress', priority: 'High', project: 'Website Redesign' },
              { id: '2', title: 'Review PRs', status: 'Review', priority: 'Medium', project: 'CRM Integration' },
              { id: '3', title: 'Write tests', status: 'To Do', priority: 'Low', project: 'Mobile App MVP' },
            ].map(task => (
              <Link key={task.id} href={`/user/tasks/${task.id}`} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50">
                <div>
                  <p className="text-sm font-medium">{task.title}</p>
                  <p className="text-xs text-muted-foreground">{task.project}</p>
                </div>
                <Badge variant={task.status === 'In Progress' ? 'default' : 'outline'}>{task.status}</Badge>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Activity className="h-5 w-5" />
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="size-2 rounded-full bg-blue-500 shrink-0" />
                <span className="text-muted-foreground">Task <span className="font-medium text-foreground">Design landing page</span> moved to <Badge variant="default" className="text-xs ml-1">In Progress</Badge></span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="size-2 rounded-full bg-green-500 shrink-0" />
                <span className="text-muted-foreground">Completed <span className="font-medium text-foreground">Set up auth flow</span></span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="size-2 rounded-full bg-amber-500 shrink-0" />
                <span className="text-muted-foreground">Submitted for review: <span className="font-medium text-foreground">Review PRs</span></span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
