'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTasks } from '@/hooks/use-tasks';
import { useAuthStore } from '@/hooks/use-auth';
import { TaskStatusBadge } from '@/components/tasks/task-status-badge';
import { TaskPriorityBadge } from '@/components/tasks/task-priority-badge';
import { TASK_STATUS_DISPLAY } from '@/lib/constants';
import { Badge } from '@/components/ui/badge';

export default function UserTasksPage() {
  const { data: tasks, isLoading } = useTasks();
  const { user } = useAuthStore();

  const myTasks = tasks?.filter((t) => t.assignees.some((a) => a.id === user?.id)) ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
        <p className="text-muted-foreground">Tasks assigned to you.</p>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 4 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : myTasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No tasks assigned to you.
                </TableCell>
              </TableRow>
            ) : (
              myTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">
                    <Link href={`/user/tasks/${task.id}`} className="hover:underline">
                      {task.title}
                    </Link>
                  </TableCell>
                  <TableCell>{task.projectTitle}</TableCell>
                  <TableCell><TaskPriorityBadge priority={task.priority} /></TableCell>
                  <TableCell>
                    <Badge variant={task.status === 'in_progress' ? 'default' : 'outline'}>
                      {TASK_STATUS_DISPLAY[task.status]}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
