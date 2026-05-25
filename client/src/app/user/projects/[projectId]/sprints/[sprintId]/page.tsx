'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TaskStatusBadge } from '@/components/tasks/task-status-badge';
import { TaskPriorityBadge } from '@/components/tasks/task-priority-badge';
import { useSprint } from '@/hooks/use-sprints';
import { ArrowLeft, Check } from 'lucide-react';

export default function UserSprintDetailPage() {
  const params = useParams<{ projectId: string; sprintId: string }>();
  const { data: sprint, isLoading } = useSprint(params.sprintId);

  if (isLoading) return <div className="flex flex-col gap-6"><Skeleton className="h-10 w-64" /><Skeleton className="h-96 w-full" /></div>;
  if (!sprint) return <div className="text-center py-12 text-muted-foreground">Sprint not found.</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button render={<Link href={`/user/projects/${params.projectId}`} />} nativeButton={false} variant="ghost" size="icon">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sprint {sprint.sprintNumber}: {sprint.title}</h1>
          <p className="text-muted-foreground">{sprint.startDate} - {sprint.endDate}</p>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-lg">Tasks</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            {sprint.tasks.map((task) => (
              <Link key={task.id} href={`/user/tasks/${task.id}`} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50">
                <div className={`shrink-0 size-5 rounded border-2 flex items-center justify-center ${
                  task.status === 'done' ? 'bg-primary border-primary' : 'border-muted-foreground/30'
                }`}>
                  {task.status === 'done' && <Check className="size-3 text-primary-foreground" />}
                </div>
                <span className="flex-1 text-sm font-medium">{task.title}</span>
                <TaskPriorityBadge priority={task.priority} />
                <TaskStatusBadge status={task.status} />
                <span className="text-xs text-muted-foreground">{task.assignees[0]?.name || '-'}</span>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
