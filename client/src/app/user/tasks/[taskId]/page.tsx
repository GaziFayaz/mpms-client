'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { TaskStatusBadge } from '@/components/tasks/task-status-badge';
import { TaskPriorityBadge } from '@/components/tasks/task-priority-badge';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Check, Clock } from 'lucide-react';

export default function UserTaskDetailPage() {
  const params = useParams<{ taskId: string }>();
  const [subtasks, setSubtasks] = useState([
    { id: '1', title: 'Research competitors', done: true },
    { id: '2', title: 'Create wireframes', done: true },
    { id: '3', title: 'Design mockups', done: false },
  ]);
  const [comment, setComment] = useState('');
  const [isLoggingTime, setIsLoggingTime] = useState(false);

  const toggleSubtask = (id: string) => {
    setSubtasks(prev => prev.map(s => s.id === id ? { ...s, done: !s.done } : s));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button render={<Link href="/user" />} nativeButton={false} variant="ghost" size="icon">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Design Landing Page</h1>
          <p className="text-muted-foreground">Task #{params.taskId} · Website Redesign</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Design a modern landing page with hero section, features, and CTA.
              </p>
              <div className="flex flex-wrap gap-4 mt-4">
                <TaskStatusBadge status="In Progress" />
                <TaskPriorityBadge priority="High" />
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Estimate: 8h</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Subtasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                {subtasks.map(sub => (
                  <div key={sub.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                    <button
                      onClick={() => toggleSubtask(sub.id)}
                      className={`shrink-0 size-5 rounded border-2 flex items-center justify-center transition-colors ${
                        sub.done ? 'bg-primary border-primary' : 'border-muted-foreground/30'
                      }`}
                    >
                      {sub.done && <Check className="size-3 text-primary-foreground" />}
                    </button>
                    <span className={`text-sm ${sub.done ? 'line-through text-muted-foreground' : ''}`}>{sub.title}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Comments</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1 text-sm">
                <span className="font-medium">Bob Lee</span>
                <span className="text-muted-foreground">Looks great, ready for review when you are.</span>
                <span className="text-xs text-muted-foreground">Jun 14, 2026</span>
              </div>
              <Textarea
                placeholder="Add a comment..."
                value={comment}
                onChange={e => setComment(e.target.value)}
                rows={3}
              />
              <Button size="sm" className="self-end">Post Comment</Button>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Button className="w-full">Move to Review</Button>
              <Button variant="outline" className="w-full" onClick={() => setIsLoggingTime(!isLoggingTime)}>
                <Clock className="mr-2 h-4 w-4" />
                {isLoggingTime ? 'Cancel' : 'Log Time'}
              </Button>
              {isLoggingTime && (
                <div className="flex flex-col gap-2 p-3 border rounded-lg">
                  <label className="text-sm">Hours</label>
                  <input type="number" className="border rounded px-2 py-1 text-sm" defaultValue="2" />
                  <label className="text-sm">Description</label>
                  <input className="border rounded px-2 py-1 text-sm" placeholder="What did you work on?" />
                  <Button size="sm">Save Time Log</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
