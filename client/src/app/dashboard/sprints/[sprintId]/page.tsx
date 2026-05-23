'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { TaskStatusBadge } from '@/components/tasks/task-status-badge';
import { TaskPriorityBadge } from '@/components/tasks/task-priority-badge';
import { ArrowLeft, Plus, Check } from 'lucide-react';

interface SprintTask {
  id: string;
  title: string;
  assignedTo: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'To Do' | 'In Progress' | 'Review' | 'Done';
}

const mockSprint = {
  id: '1',
  number: 3,
  title: 'Sprint 3 - Core Features',
  project: 'Website Redesign',
  startDate: '2026-06-01',
  endDate: '2026-06-14',
  goal: 'Complete the core feature set including user authentication, dashboard layout, and project management views.',
};

const mockTasks: SprintTask[] = [
  { id: '1', title: 'Design landing page', assignedTo: 'Alice', priority: 'High', status: 'In Progress' },
  { id: '2', title: 'Build user auth flow', assignedTo: 'Bob', priority: 'Critical', status: 'Done' },
  { id: '3', title: 'Create dashboard layout', assignedTo: 'Carol', priority: 'High', status: 'In Progress' },
  { id: '4', title: 'Set up project CRUD', assignedTo: 'Dave', priority: 'Medium', status: 'To Do' },
  { id: '5', title: 'Implement search filter', assignedTo: 'Alice', priority: 'Low', status: 'To Do' },
];

export default function SprintDetailPage() {
  const params = useParams<{ sprintId: string }>();
  const [newTask, setNewTask] = useState('');

  const doneTasks = mockTasks.filter(t => t.status === 'Done').length;
  const progress = Math.round((doneTasks / mockTasks.length) * 100);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button render={<Link href="/dashboard/projects" />} nativeButton={false} variant="ghost" size="icon">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Sprint {mockSprint.number}: {mockSprint.title}</h1>
          <p className="text-muted-foreground">
            {mockSprint.project} · {mockSprint.startDate} to {mockSprint.endDate}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="md:col-span-1 p-4 flex flex-col items-center justify-center text-center">
          <div className="text-3xl font-bold">{mockTasks.length}</div>
          <div className="text-sm text-muted-foreground">Total Tasks</div>
        </Card>
        <Card className="md:col-span-1 p-4 flex flex-col items-center justify-center text-center">
          <div className="text-3xl font-bold">{doneTasks}</div>
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
        <CardHeader>
          <CardTitle className="text-lg">Sprint Goal</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{mockSprint.goal}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Tasks</CardTitle>
          <div className="flex gap-2">
            <Input 
              placeholder="Quick add task..." 
              className="w-48" 
              value={newTask}
              onChange={e => setNewTask(e.target.value)}
            />
            <Button size="sm">Add</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            {mockTasks.map(task => (
              <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50">
                <div className={`shrink-0 size-5 rounded border-2 flex items-center justify-center ${
                  task.status === 'Done' ? 'bg-primary border-primary' : 'border-muted-foreground/30'
                }`}>
                  {task.status === 'Done' && <Check className="size-3 text-primary-foreground" />}
                </div>
                <Link href={`/dashboard/tasks/${task.id}`} className="flex-1 text-sm font-medium hover:underline">
                  {task.title}
                </Link>
                <TaskPriorityBadge priority={task.priority} />
                <TaskStatusBadge status={task.status} />
                <span className="text-xs text-muted-foreground">{task.assignedTo}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
