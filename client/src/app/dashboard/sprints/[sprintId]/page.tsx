'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { TaskStatusBadge } from '@/components/tasks/task-status-badge';
import { TaskPriorityBadge } from '@/components/tasks/task-priority-badge';
import { useSprint } from '@/hooks/use-sprints';
import { ArrowLeft, Check } from 'lucide-react';

export default function SprintDetailPage() {
  const params = useParams<{ sprintId: string }>();
  const { data: sprint, isLoading } = useSprint(params.sprintId);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!sprint) {
    return <div className="text-center py-12 text-muted-foreground">Sprint not found.</div>;
  }

  const progress = sprint.stats.total_tasks > 0
    ? Math.round((sprint.stats.completed_tasks / sprint.stats.total_tasks) * 100)
    : 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button render={<Link href="/dashboard/projects" />} nativeButton={false} variant="ghost" size="icon">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Sprint {sprint.sprintNumber}: {sprint.title}</h1>
          <p className="text-muted-foreground">{sprint.startDate} to {sprint.endDate}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <div className="text-3xl font-bold">{sprint.stats.total_tasks}</div>
          <div className="text-sm text-muted-foreground">Total Tasks</div>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <div className="text-3xl font-bold">{sprint.stats.completed_tasks}</div>
          <div className="text-sm text-muted-foreground">Completed</div>
        </Card>
        <Card className="md:col-span-2 p-4 flex flex-col justify-center">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-lg">Tasks</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            {sprint.tasks.map((task) => (
              <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50">
                <div className={`shrink-0 size-5 rounded border-2 flex items-center justify-center ${
                  task.status === 'done' ? 'bg-primary border-primary' : 'border-muted-foreground/30'
                }`}>
                  {task.status === 'done' && <Check className="size-3 text-primary-foreground" />}
                </div>
                <Link href={`/dashboard/tasks/${task.id}`} className="flex-1 text-sm font-medium hover:underline">
                  {task.title}
                </Link>
                <TaskPriorityBadge priority={task.priority} />
                <TaskStatusBadge status={task.status} />
                <span className="text-xs text-muted-foreground">{task.assignees[0]?.name || '-'}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
