'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { TaskStatusBadge } from '@/components/tasks/task-status-badge';
import { TaskPriorityBadge } from '@/components/tasks/task-priority-badge';
import { ArrowLeft, Plus, Check, X, Trash, MessageSquare, Paperclip, Clock, Edit } from 'lucide-react';

const nextStatus: Record<string, string> = {
  'To Do': 'In Progress',
  'In Progress': 'Review',
  'Review': 'Done',
};

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

interface Comment {
  id: string;
  author: string;
  text: string;
  date: string;
}

const mockSubtasks: Subtask[] = [
  { id: 's1', title: 'Research competitor designs', completed: true },
  { id: 's2', title: 'Create wireframes', completed: true },
  { id: 's3', title: 'Design high-fidelity mockups', completed: false },
  { id: 's4', title: 'Get stakeholder approval', completed: false },
];

const mockComments: Comment[] = [
  { id: 'c1', author: 'Bob Lee', text: 'Looks good so far. Can we increase the contrast on the header?', date: 'Jun 14, 2026' },
  { id: 'c2', author: 'Alice Chen', text: 'Sure, I will update that in the next iteration.', date: 'Jun 14, 2026' },
];

export default function TaskDetailPage() {
  const params = useParams<{ taskId: string }>();
  const [subtasks, setSubtasks] = useState(mockSubtasks);
  const [newSubtask, setNewSubtask] = useState('');
  const [comments] = useState(mockComments);
  const [newComment, setNewComment] = useState('');
  const [status, setStatus] = useState('In Progress');
  const taskId = params.taskId;

  const subtaskProgress = subtasks.length > 0 
    ? Math.round((subtasks.filter(s => s.completed).length / subtasks.length) * 100) 
    : 0;

  const toggleSubtask = (id: string) => {
    setSubtasks(prev => prev.map(s => s.id === id ? { ...s, completed: !s.completed } : s));
  };

  const addSubtask = () => {
    if (!newSubtask.trim()) return;
    setSubtasks(prev => [...prev, { id: `s${Date.now()}`, title: newSubtask.trim(), completed: false }]);
    setNewSubtask('');
  };

  const removeSubtask = (id: string) => {
    setSubtasks(prev => prev.filter(s => s.id !== id));
  };

  const advanceStatus = () => {
    setStatus(prev => nextStatus[prev] || prev);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button render={<Link href="/dashboard/tasks" />} nativeButton={false} variant="ghost" size="icon">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Design Landing Page</h1>
          <p className="text-muted-foreground">Task #{taskId} · In Website Redesign</p>
        </div>
        <Button render={<Link href={`/dashboard/tasks/${taskId}/edit`} />} nativeButton={false} variant="outline">
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Design a modern landing page for the Acme Corp website redesign. 
                Must include hero section, features grid, testimonials carousel, and call-to-action.
              </p>
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <TaskStatusBadge status={status as any} />
                </div>
                <div className="flex items-center gap-2">
                  <TaskPriorityBadge priority="High" />
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Estimate: 8h</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subtasks */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">
                Subtasks
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  {subtasks.filter(s => s.completed).length}/{subtasks.length}
                </span>
              </CardTitle>
              <Progress value={subtaskProgress} className="w-24" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2 mb-4">
                {subtasks.map(subtask => (
                  <div key={subtask.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                    <button
                      onClick={() => toggleSubtask(subtask.id)}
                      className={`shrink-0 size-5 rounded border-2 flex items-center justify-center transition-colors ${
                        subtask.completed 
                          ? 'bg-primary border-primary text-primary-foreground' 
                          : 'border-muted-foreground/30 hover:border-primary'
                      }`}
                    >
                      {subtask.completed && <Check className="size-3" />}
                    </button>
                    <span className={`text-sm flex-1 ${subtask.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {subtask.title}
                    </span>
                    <button onClick={() => removeSubtask(subtask.id)} className="text-muted-foreground hover:text-destructive">
                      <X className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input 
                  placeholder="Add a subtask..." 
                  value={newSubtask}
                  onChange={e => setNewSubtask(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addSubtask()}
                />
                <Button size="sm" onClick={addSubtask}>Add</Button>
              </div>
            </CardContent>
          </Card>

          {/* Attachments */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Attachments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 p-2 rounded-lg border">
                  <Paperclip className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm flex-1">wireframe-v2.fig</span>
                  <Button variant="ghost" size="sm">View</Button>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg border">
                  <Paperclip className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm flex-1">requirements.pdf</span>
                  <Button variant="ghost" size="sm">View</Button>
                </div>
              </div>
              <Button variant="outline" className="mt-4 w-full">
                <Plus className="mr-2 h-4 w-4" />
                Upload Attachment
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel */}
        <div className="flex flex-col gap-6">
          {/* Status Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {status !== 'Done' && (
                <Button onClick={advanceStatus} className="w-full">
                  Move to {nextStatus[status] || 'Next'}
                </Button>
              )}
              {status === 'Done' && (
                <p className="text-sm text-muted-foreground text-center">This task is completed.</p>
              )}
              <Button variant="outline" className="w-full">
                <Clock className="mr-2 h-4 w-4" />
                Log Time
              </Button>
            </CardContent>
          </Card>

          {/* Comments */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              <CardTitle className="text-lg">Comments</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {comments.map(comment => (
                <div key={comment.id} className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{comment.author}</span>
                    <span className="text-xs text-muted-foreground">{comment.date}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{comment.text}</p>
                </div>
              ))}
              <div className="flex flex-col gap-2 mt-2">
                <Textarea 
                  placeholder="Add a comment..." 
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  rows={3}
                />
                <Button size="sm" className="self-end">
                  Post Comment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
