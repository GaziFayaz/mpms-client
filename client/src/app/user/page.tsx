'use client';

import Link from 'next/link';
import { useAuthStore } from '@/hooks/use-auth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useTasks } from '@/hooks/use-tasks';
import { TASK_STATUS_DISPLAY } from '@/lib/constants';
import { CheckSquare, Clock, Folder, Activity } from 'lucide-react';

export default function UserDashboard() {
  const { user } = useAuthStore();
  const { data: tasksResponse, isLoading } = useTasks({ limit: 100 });
  const tasksData = tasksResponse?.data ?? [];

  const myTasks = tasksData.filter((t) => t.assignees.some((a) => a.id === user?.id));
  const completedCount = myTasks.filter((t) => t.status === 'done').length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.name || 'User'}</h1>
        <p className="text-muted-foreground">Here&apos;s your work overview for today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myTasks.length}</div>
            <p className="text-xs text-muted-foreground">{completedCount} completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myTasks.filter((t) => t.status === 'in_progress').length}</div>
            <p className="text-xs text-muted-foreground">Tasks being worked on</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <Folder className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(myTasks.map((t) => t.projectId)).size}</div>
            <p className="text-xs text-muted-foreground">Projects involved</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>My Tasks</CardTitle></CardHeader>
        <CardContent className="flex flex-col gap-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)
          ) : myTasks.length === 0 ? (
            <p className="text-sm text-muted-foreground">No tasks assigned to you.</p>
          ) : (
            myTasks.slice(0, 10).map((task) => (
              <Link key={task.id} href={`/user/tasks/${task.id}`} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50">
                <div>
                  <p className="text-sm font-medium">{task.title}</p>
                  <p className="text-xs text-muted-foreground">{task.projectTitle}</p>
                </div>
                <Badge variant={task.status === 'in_progress' ? 'default' : 'outline'}>
                  {TASK_STATUS_DISPLAY[task.status]}
                </Badge>
              </Link>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
