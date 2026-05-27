'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { TaskStatusBadge } from '@/components/tasks/task-status-badge';
import { TaskPriorityBadge } from '@/components/tasks/task-priority-badge';
import { useTask, useToggleSubtask, useAddComment, useUpdateTaskStatus } from '@/hooks/use-tasks';
import { TASK_STATUS_TRANSITIONS, TASK_STATUS_DISPLAY } from '@/lib/constants';
import { ArrowLeft, Check, Clock } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function UserTaskDetailPage() {
  const params = useParams<{ taskId: string }>();
  const taskId = params.taskId;
  const { data: task, isLoading } = useTask(taskId);
  const toggleSubtask = useToggleSubtask();
  const addComment = useAddComment();
  const updateStatus = useUpdateTaskStatus();
  const [comment, setComment] = useState('');

  if (isLoading) return <div className="flex flex-col gap-6"><Skeleton className="h-10 w-64" /><Skeleton className="h-96 w-full" /></div>;
  if (!task) return <div className="text-center py-12 text-muted-foreground">Task not found.</div>;

  const nextStatuses = TASK_STATUS_TRANSITIONS[task.status] || [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button render={<Link href="/user" />} nativeButton={false} variant="ghost" size="icon">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{task.title}</h1>
          <p className="text-muted-foreground">Task {taskId.slice(0, 8)} · {task.projectTitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card>
            <CardHeader><CardTitle className="text-lg">Description</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{task.description || 'No description.'}</p>
              <div className="flex flex-wrap gap-4 mt-4">
                <TaskStatusBadge status={task.status} />
                <TaskPriorityBadge priority={task.priority} />
                {task.estimateHours && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" /><span>Est: {task.estimateHours}h</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">Subtasks</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                {task.subtasks.map((sub) => (
                  <div key={sub.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                    <button
                      onClick={() => toggleSubtask.mutate({ taskId: task.id, subtaskId: sub.id, completed: !sub.completed })}
                      className={`shrink-0 size-5 rounded border-2 flex items-center justify-center transition-colors ${
                        sub.completed ? 'bg-primary border-primary' : 'border-muted-foreground/30'
                      }`}
                    >
                      {sub.completed && <Check className="size-3 text-primary-foreground" />}
                    </button>
                    <span className={`text-sm ${sub.completed ? 'line-through text-muted-foreground' : ''}`}>{sub.title}</span>
                  </div>
                ))}
                {task.subtasks.length === 0 && <p className="text-sm text-muted-foreground">No subtasks.</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">Comments</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-4">
              {task.comments.map((c) => (
                <div key={c.id} className="flex flex-col gap-1 text-sm">
                  <span className="font-medium">{c.userName}</span>
                  <span className="text-muted-foreground">{c.body}</span>
                  <span className="text-xs text-muted-foreground">{formatDate(c.createdAt)}</span>
                </div>
              ))}
              <Textarea placeholder="Add a comment..." value={comment} onChange={(e) => setComment(e.target.value)} rows={3} />
              <Button size="sm" className="self-end" onClick={() => { addComment.mutate({ taskId: task.id, body: comment }); setComment(''); }} disabled={addComment.isPending || !comment.trim()}>
                Post
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader><CardTitle className="text-lg">Actions</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-3">
              {nextStatuses.map((status) => (
                <Button key={status} className="w-full" onClick={() => updateStatus.mutate({ id: task.id, status })} disabled={updateStatus.isPending}>
                  Move to {TASK_STATUS_DISPLAY[status]}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
