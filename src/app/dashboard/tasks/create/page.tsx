'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useCreateTask } from '@/hooks/use-tasks';
import TaskForm from '@/components/tasks/task-form';
import { ArrowLeft } from 'lucide-react';

function CreateTaskContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sprintId = searchParams.get('sprintId') || '';
  const createTask = useCreateTask();

  const handleCreate = async (data: {
    sprintId: string;
    title: string;
    description?: string;
    priority?: string;
    estimateHours?: number | null;
    dueDate?: string;
    assigneeIds: string[];
    status?: string;
  }) => {
    await createTask.mutateAsync({
      sprintId: data.sprintId,
      title: data.title,
      description: data.description,
      priority: data.priority,
      estimateHours: data.estimateHours ?? undefined,
      dueDate: data.dueDate || undefined,
      assigneeIds: data.assigneeIds,
    });
    router.back();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button render={<Link href="/dashboard/tasks" />} nativeButton={false} variant="ghost" size="icon">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Task</h1>
          <p className="text-muted-foreground">Add a new task to a sprint.</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <TaskForm
            open
            onClose={() => router.back()}
            onSubmit={handleCreate}
            isPending={createTask.isPending}
            defaultSprintId={sprintId}
            inline
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default function CreateTaskPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full" />}>
      <CreateTaskContent />
    </Suspense>
  );
}
