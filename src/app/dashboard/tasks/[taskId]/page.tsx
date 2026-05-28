'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { TaskStatusBadge } from '@/components/tasks/task-status-badge';
import { TaskPriorityBadge } from '@/components/tasks/task-priority-badge';
import { useTask, useAddSubtask, useToggleSubtask, useAddComment, useUpdateTaskStatus, useDeleteTask, useUploadAttachment, useDeleteAttachment } from '@/hooks/use-tasks';
import { TASK_STATUS_TRANSITIONS, TASK_STATUS_DISPLAY } from '@/lib/constants';
import { ArrowLeft, Check, X, Clock, MessageSquare, Edit, Trash, Upload, FileText } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import Image from 'next/image';
import type { Attachment } from '@/types';

export default function TaskDetailPage() {
  const params = useParams<{ taskId: string }>();
  const router = useRouter();
  const taskId = params.taskId;
  const { data: task, isLoading } = useTask(taskId);
  const addSubtask = useAddSubtask();
  const toggleSubtask = useToggleSubtask();
  const addComment = useAddComment();
  const updateStatus = useUpdateTaskStatus();
  const deleteTask = useDeleteTask();
  const uploadAttachment = useUploadAttachment();
  const deleteAttachment = useDeleteAttachment();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newSubtask, setNewSubtask] = useState('');
  const [newComment, setNewComment] = useState('');

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2"><Skeleton className="h-96 w-full" /></div>
          <div><Skeleton className="h-48 w-full" /></div>
        </div>
      </div>
    );
  }

  if (!task) {
    return <div className="text-center py-12 text-muted-foreground">Task not found.</div>;
  }

  const subtaskProgress = task.subtasks.length > 0
    ? Math.round((task.subtasks.filter((s) => s.completed).length / task.subtasks.length) * 100)
    : 0;

  const nextStatuses = TASK_STATUS_TRANSITIONS[task.status] || [];

  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return;
    addSubtask.mutate({ taskId: task.id, title: newSubtask.trim() });
    setNewSubtask('');
  };

  const handlePostComment = () => {
    if (!newComment.trim()) return;
    addComment.mutate({ taskId: task.id, body: newComment.trim() });
    setNewComment('');
  };

  const handleStatusChange = (status: typeof nextStatuses[number]) => {
    updateStatus.mutate({ id: task.id, status });
  };

  const handleDeleteTask = async () => {
    if (!confirm('Delete this task? This cannot be undone.')) return;
    await deleteTask.mutateAsync(task.id);
    router.push('/dashboard/tasks');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadAttachment.mutate({ taskId: task.id, file });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const isImage = (type: string) => type.startsWith('image/');

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button render={<Link href="/dashboard/tasks" />} nativeButton={false} variant="ghost" size="icon">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{task.title}</h1>
          <p className="text-muted-foreground">Task {task.id.slice(0, 8)} · {task.projectTitle}</p>
        </div>
        <Button render={<Link href={`/dashboard/tasks/${task.id}/edit`} />} nativeButton={false} variant="outline">
          <Edit className="mr-2 h-4 w-4" />Edit
        </Button>
        <Button variant="destructive" onClick={handleDeleteTask} disabled={deleteTask.isPending}>
          <Trash className="mr-2 h-4 w-4" />Delete
        </Button>
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
                {task.dueDate && (
                  <div className="text-sm text-muted-foreground">
                    Due: {formatDate(task.dueDate)}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">
                Subtasks
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  {task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length}
                </span>
              </CardTitle>
              <Progress value={subtaskProgress} className="w-24" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2 mb-4">
                {task.subtasks.map((subtask) => (
                  <div key={subtask.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                    <button
                      onClick={() => toggleSubtask.mutate({ taskId: task.id, subtaskId: subtask.id, completed: !subtask.completed })}
                      className={`shrink-0 size-5 rounded border-2 flex items-center justify-center transition-colors ${
                        subtask.completed ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground/30 hover:border-primary'
                      }`}
                    >
                      {subtask.completed && <Check className="size-3" />}
                    </button>
                    <span className={`text-sm flex-1 ${subtask.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {subtask.title}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a subtask..."
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()}
                />
                <Button size="sm" onClick={handleAddSubtask} disabled={addSubtask.isPending}>Add</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Attachments</CardTitle>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/gif,application/pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploadAttachment.isPending}>
                <Upload className="mr-2 h-4 w-4" />
                {uploadAttachment.isPending ? 'Uploading...' : 'Upload'}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                {task.attachments && task.attachments.length > 0 ? (
                  task.attachments.map((att: Attachment) => (
                    <div key={att.id} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50">
                      <div className="shrink-0">
                    {isImage(att.fileType) ? (
                      <Image src={att.fileUrl} alt={att.fileName} width={40} height={40} className="size-10 object-cover rounded" />
                    ) : (
                          <FileText className="size-10 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <a href={att.fileUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:underline block truncate">
                          {att.fileName}
                        </a>
                        <span className="text-xs text-muted-foreground">{(att.fileSize / 1024).toFixed(0)} KB · {formatDate(att.createdAt)}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => deleteAttachment.mutate({ attachmentId: att.id, taskId: task.id })}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No attachments yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader><CardTitle className="text-lg">Actions</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-3">
              {nextStatuses.length > 0 ? (
                nextStatuses.map((status) => (
                  <Button key={status} onClick={() => handleStatusChange(status)} className="w-full" disabled={updateStatus.isPending}>
                    Move to {TASK_STATUS_DISPLAY[status]}
                  </Button>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center">Task completed.</p>
              )}
              <Button variant="outline" className="w-full">
                <Clock className="mr-2 h-4 w-4" />Log Time
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <MessageSquare className="h-5 w-5" /><CardTitle className="text-lg">Comments</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {task.comments.length === 0 && (
                <p className="text-sm text-muted-foreground">No comments yet.</p>
              )}
              {task.comments.map((comment) => (
                <div key={comment.id} className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{comment.userName}</span>
                    <span className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{comment.body}</p>
                </div>
              ))}
              <div className="flex flex-col gap-2 mt-2">
                <Textarea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                />
                <Button size="sm" className="self-end" onClick={handlePostComment} disabled={addComment.isPending}>
                  Post Comment
                </Button>
              </div>
            </CardContent>
          </Card>

          {task.activityLog.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-lg">Activity</CardTitle></CardHeader>
              <CardContent className="flex flex-col gap-2">
                {task.activityLog.map((entry) => (
                  <div key={entry.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{entry.userName}</span>
                    <span>{entry.action.replace(/_/g, ' ')}</span>
                    <span>·</span>
                    <span>{formatDate(entry.createdAt)}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
