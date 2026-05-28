'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { TaskStatusBadge } from '@/components/tasks/task-status-badge';
import { TaskPriorityBadge } from '@/components/tasks/task-priority-badge';
import { useSprint, useSprintTasks, useUpdateSprint, useDeleteSprint } from '@/hooks/use-sprints';
import SprintForm from '@/components/sprints/sprint-form';
import { ArrowLeft, Plus, Edit, Trash, Check } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function SprintDetailPage() {
  const params = useParams<{ sprintId: string }>();
  const router = useRouter();
  const { data: sprint, isLoading } = useSprint(params.sprintId);
  const { data: tasks, isLoading: tasksLoading } = useSprintTasks(params.sprintId);
  const updateSprint = useUpdateSprint();
  const deleteSprint = useDeleteSprint();

  const [sprintModalOpen, setSprintModalOpen] = useState(false);

  if (isLoading || tasksLoading) {
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

  const sprintTasks = tasks ?? [];
  const totalTasks = sprintTasks.length;
  const completedTasks = sprintTasks.filter((t) => t.status === 'done').length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleEditSubmit = async (data: { title: string; startDate: string; endDate: string }) => {
    await updateSprint.mutateAsync({
      id: sprint.id,
      projectId: sprint.projectId,
      title: data.title,
      startDate: new Date(data.startDate).toISOString(),
      endDate: new Date(data.endDate).toISOString(),
    });
    setSprintModalOpen(false);
  };

  const handleDelete = async () => {
    if (!confirm(`Delete Sprint ${sprint.sprintNumber}: "${sprint.title}"?`)) return;
    await deleteSprint.mutateAsync({ id: sprint.id, projectId: sprint.projectId });
    router.push('/dashboard/projects');
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button render={<Link href="/dashboard/projects" />} nativeButton={false} variant="ghost" size="icon">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Sprint {sprint.sprintNumber}: {sprint.title}</h1>
          <p className="text-muted-foreground">{formatDate(sprint.startDate)} to {formatDate(sprint.endDate)}</p>
        </div>
        <Button onClick={() => setSprintModalOpen(true)} variant="outline">
          <Edit className="mr-2 h-4 w-4" />Edit
        </Button>
        <Button variant="destructive" onClick={handleDelete} disabled={deleteSprint.isPending}>
          <Trash className="mr-2 h-4 w-4" />Delete
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <div className="text-3xl font-bold">{totalTasks}</div>
          <div className="text-sm text-muted-foreground">Total Tasks</div>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <div className="text-3xl font-bold">{completedTasks}</div>
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
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <SprintForm
        open={sprintModalOpen}
        onClose={() => setSprintModalOpen(false)}
        onSubmit={handleEditSubmit}
        sprint={sprint}
        isPending={updateSprint.isPending}
      />
    </div>
  );
}
