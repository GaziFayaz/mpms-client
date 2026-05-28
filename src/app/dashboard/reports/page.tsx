'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { useReportsOverview } from '@/hooks/use-reports';
import { PROJECT_STATUS_DISPLAY } from '@/lib/constants';
import { Folder, CheckSquare, Clock, TrendingUp } from 'lucide-react';

export default function ReportsPage() {
  const { data: projects, isLoading } = useReportsOverview();

  const totalTasks = projects?.reduce((sum, p) => sum + p.total_tasks, 0) ?? 0;
  const avgProgress = projects?.length
    ? Math.round(projects.reduce((sum, p) => sum + p.progress_percent, 0) / projects.length)
    : 0;

  const statusCounts = { todo: 0, in_progress: 0, review: 0, done: 0 };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">Project progress and team performance.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <Folder className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '-' : projects?.length ?? 0}</div>
            <p className="text-xs text-muted-foreground">{projects?.filter(p => p.status === 'active').length ?? 0} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '-' : totalTasks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '-' : `${avgProgress}%`}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '-' : projects?.filter(p => p.status === 'active').length ?? 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Project Progress</CardTitle></CardHeader>
        <CardContent className="flex flex-col gap-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)
          ) : (
            projects?.map((p) => (
              <div key={p.id} className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span>{p.title}</span>
                    <span className="text-xs text-muted-foreground">({p.client})</span>
                  </div>
                  <span className="text-muted-foreground">{p.progress_percent}%</span>
                </div>
                <Progress value={p.progress_percent} />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{p.completed_tasks} / {p.total_tasks} tasks</span>
                  <span>{PROJECT_STATUS_DISPLAY[p.status]}</span>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
