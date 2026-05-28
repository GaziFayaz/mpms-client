'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useTasks } from '@/hooks/use-tasks';
import { TaskStatusBadge } from '@/components/tasks/task-status-badge';
import { TaskPriorityBadge } from '@/components/tasks/task-priority-badge';
import TaskFilters from '@/components/tasks/task-filters';
import { Plus, Columns3, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { ITEMS_PER_PAGE } from '@/lib/constants';

export default function TasksPage() {
  const [projectId, setProjectId] = useState('');
  const [sprintId, setSprintId] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [assignee, setAssignee] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const params: Record<string, string> = { page: String(page), limit: String(ITEMS_PER_PAGE) };
  if (projectId) params.project = projectId;
  if (sprintId) params.sprint = sprintId;
  if (status) params.status = status;
  if (priority) params.priority = priority;
  if (assignee) params.assignee = assignee;

  const { data: tasksResponse, isLoading } = useTasks(params);

  const tasks = tasksResponse?.data ?? [];
  const totalPages = tasksResponse?.totalPages ?? 1;
  const total = tasksResponse?.total ?? 0;

  const filteredBySearch = search
    ? tasks.filter((t) => t.title.toLowerCase().includes(search.toLowerCase()))
    : tasks;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">{total} tasks total</p>
        </div>
        <div className="flex gap-2">
          <Button render={<Link href="/dashboard/tasks/create" />} nativeButton={false}>
            <Plus className="mr-2 h-4 w-4" />Create Task
          </Button>
          <Button render={<Link href="/dashboard/tasks/kanban" />} nativeButton={false} variant="outline">
            <Columns3 className="mr-2 h-4 w-4" />Kanban Board
          </Button>
        </div>
      </div>

      <TaskFilters
        projectId={projectId}
        sprintId={sprintId}
        status={status}
        priority={priority}
        assignee={assignee}
        search={search}
        onProjectChange={(val) => { setProjectId(val); setSprintId(''); setPage(1); }}
        onSprintChange={(val) => { setSprintId(val); setPage(1); }}
        onStatusChange={(val) => { setStatus(val); setPage(1); }}
        onPriorityChange={(val) => { setPriority(val); setPage(1); }}
        onAssigneeChange={(val) => { setAssignee(val); setPage(1); }}
        onSearchChange={(val) => setSearch(val)}
      />

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Sprint</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Estimate</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 7 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : filteredBySearch.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No tasks found
                </TableCell>
              </TableRow>
            ) : (
              filteredBySearch.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">
                    <Link href={`/dashboard/tasks/${task.id}`} className="hover:underline">
                      {task.title}
                    </Link>
                  </TableCell>
                  <TableCell>{task.projectTitle}</TableCell>
                  <TableCell>{task.sprintTitle || '-'}</TableCell>
                  <TableCell>{task.assignees.map((a) => a.name).join(', ')}</TableCell>
                  <TableCell>
                    {task.estimateHours ? (
                      <span className="flex items-center gap-1 text-xs"><Clock className="h-3 w-3" />{task.estimateHours}h</span>
                    ) : '-'}
                  </TableCell>
                  <TableCell><TaskPriorityBadge priority={task.priority} /></TableCell>
                  <TableCell><TaskStatusBadge status={task.status} /></TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />Prev
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            Next<ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
