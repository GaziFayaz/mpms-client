'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TaskStatusBadge } from '@/components/tasks/task-status-badge';
import { TaskPriorityBadge } from '@/components/tasks/task-priority-badge';
import { ArrowLeft, Check } from 'lucide-react';

export default function UserSprintDetailPage() {
  const params = useParams<{ projectId: string; sprintId: string }>();

  const tasks = [
    { id: '1', title: 'Design landing page', assignedTo: 'You', priority: 'High' as const, status: 'In Progress' as const, done: false },
    { id: '2', title: 'Set up CI/CD', assignedTo: 'Bob', priority: 'Medium' as const, status: 'To Do' as const, done: false },
    { id: '3', title: 'Write API docs', assignedTo: 'You', priority: 'Low' as const, status: 'Done' as const, done: true },
  ];

  const done = tasks.filter(t => t.done).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button render={<Link href={`/user/projects/${params.projectId}`} />} nativeButton={false} variant="ghost" size="icon">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sprint 1: Initial Setup</h1>
          <p className="text-muted-foreground">May 20 - Jun 3, 2026</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            {tasks.map(task => (
              <Link
                key={task.id}
                href={`/user/tasks/${task.id}`}
                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50"
              >
                <div className={`shrink-0 size-5 rounded border-2 flex items-center justify-center ${
                  task.done ? 'bg-primary border-primary' : 'border-muted-foreground/30'
                }`}>
                  {task.done && <Check className="size-3 text-primary-foreground" />}
                </div>
                <span className="flex-1 text-sm font-medium">{task.title}</span>
                <TaskPriorityBadge priority={task.priority} />
                <TaskStatusBadge status={task.status} />
                <span className="text-xs text-muted-foreground">{task.assignedTo}</span>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
