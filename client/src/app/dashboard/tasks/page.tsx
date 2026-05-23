'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TaskStatusBadge } from '@/components/tasks/task-status-badge';
import { TaskPriorityBadge } from '@/components/tasks/task-priority-badge';
import { Search, Columns3 } from 'lucide-react';

const mockTasks = [
  { id: '1', title: 'Design landing page', project: 'Website Redesign', sprint: 'Sprint 1', assignee: 'Alice Chen', priority: 'High' as const, status: 'In Progress' as const, dueDate: '2026-06-15', estimate: '8h' },
  { id: '2', title: 'Set up CI/CD pipeline', project: 'CRM Integration', sprint: 'Sprint 2', assignee: 'Bob Lee', priority: 'Medium' as const, status: 'To Do' as const, dueDate: '2026-06-20', estimate: '16h' },
  { id: '3', title: 'Write API docs', project: 'Mobile App MVP', sprint: 'Sprint 1', assignee: 'Carol Wu', priority: 'Low' as const, status: 'Done' as const, dueDate: '2026-06-10', estimate: '4h' },
  { id: '4', title: 'Review PRs', project: 'Website Redesign', sprint: 'Sprint 1', assignee: 'Dave Kim', priority: 'High' as const, status: 'Review' as const, dueDate: '2026-06-12', estimate: '2h' },
  { id: '5', title: 'Fix payment bug', project: 'Marketing Campaign', sprint: 'Sprint 3', assignee: 'Eve Park', priority: 'Critical' as const, status: 'In Progress' as const, dueDate: '2026-06-08', estimate: '6h' },
];

export default function TasksPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">View and manage all tasks across projects.</p>
        </div>
        <Button render={<Link href="/dashboard/tasks/kanban" />} nativeButton={false} variant="outline">
          <Columns3 className="mr-2 h-4 w-4" />
          Kanban Board
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search tasks..." className="pl-8" />
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Sprint</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Estimate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockTasks.map(task => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">
                  <Link href={`/dashboard/tasks/${task.id}`} className="hover:underline">
                    {task.title}
                  </Link>
                </TableCell>
                <TableCell>{task.project}</TableCell>
                <TableCell>{task.sprint}</TableCell>
                <TableCell>{task.assignee}</TableCell>
                <TableCell><TaskPriorityBadge priority={task.priority} /></TableCell>
                <TableCell><TaskStatusBadge status={task.status} /></TableCell>
                <TableCell>{task.dueDate}</TableCell>
                <TableCell>{task.estimate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
