'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TaskStatusBadge } from '@/components/tasks/task-status-badge';
import { TaskPriorityBadge } from '@/components/tasks/task-priority-badge';
import { useSprint, useSprintTasks } from '@/hooks/use-sprints';
import { ArrowLeft, Plus, Check } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function UserSprintDetailPage() {
  const params = useParams<{ projectId: string; sprintId: string }>();
  const router = useRouter();
  const { data: sprint, isLoading } = useSprint(params.sprintId);
  const { data: tasks, isLoading: tasksLoading } = useSprintTasks(params.sprintId);

  if (isLoading || tasksLoading) return <div className="flex flex-col gap-6"><Skeleton className="h-10 w-64" /><Skeleton className="h-96 w-full" /></div>;
  if (!sprint) return <div className="text-center py-12 text-muted-foreground">Sprint not found.</div>;

  const sprintTasks = tasks ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button render={<Link href={`/user/projects/${params.projectId}`} />} nativeButton={false} variant="ghost" size="icon">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Sprint {sprint.sprintNumber}: {sprint.title}</h1>
          <p className="text-muted-foreground">{formatDate(sprint.startDate)} - {formatDate(sprint.endDate)}</p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Tasks</CardTitle>
          <Button onClick={() => router.push(`/dashboard/tasks/create?sprintId=${sprint.id}`)} size="sm">
            <Plus className="mr-2 h-4 w-4" />Create Task
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            {sprintTasks.length === 0 ? (
              <div className="text-center py-8 border rounded-lg border-dashed">
                <p className="text-muted-foreground">No tasks yet.</p>
              </div>
            ) : (
              sprintTasks.map((task) => (
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
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
