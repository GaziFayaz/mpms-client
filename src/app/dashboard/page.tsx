'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useReportsOverview } from '@/hooks/use-reports';
import { Skeleton } from '@/components/ui/skeleton';
import { Folder, CheckSquare, Clock, Users } from 'lucide-react';

export default function DashboardOverview() {
  const { data: projects, isLoading, error } = useReportsOverview();

  const totalProjects = projects?.length ?? 0;
  const activeProjects = projects?.filter(p => p.status === 'active').length ?? 0;
  const totalTasks = projects?.reduce((sum, p) => sum + p.total_tasks, 0) ?? 0;
  const avgProgress = projects?.length
    ? Math.round(projects.reduce((sum, p) => sum + p.progress_percent, 0) / projects.length)
    : 0;

  const stats = [
    { title: 'Total Projects', value: totalProjects, icon: Folder, desc: `${activeProjects} active` },
    { title: 'Total Tasks', value: totalTasks, icon: CheckSquare, desc: 'Across all projects' },
    { title: 'Avg Progress', value: `${avgProgress}%`, icon: Clock, desc: 'Overall completion' },
    { title: 'Team Members', value: '-', icon: Users, desc: 'Via Team page' },
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
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-12 mb-1" />
                  <Skeleton className="h-3 w-20" />
                </CardContent>
              </Card>
            ))
          : stats.map((stat, i) => (
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

      {error && (
        <Card>
          <CardContent className="p-4 text-sm text-destructive">
            Failed to load dashboard data. Ensure backend is running.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
