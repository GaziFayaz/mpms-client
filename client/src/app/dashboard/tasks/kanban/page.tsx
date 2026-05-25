'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { TaskPriorityBadge } from '@/components/tasks/task-priority-badge';
import { useTasks, useUpdateKanbanOrder } from '@/hooks/use-tasks';
import { TASK_STATUS_DISPLAY } from '@/lib/constants';
import { List } from 'lucide-react';
import type { TaskListItem, TaskStatus } from '@/types';import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const COLUMNS: TaskStatus[] = ['todo', 'in_progress', 'review', 'done'];

function KanbanCard({ task }: { task: TaskListItem }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { task },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
      <Card className="p-3 hover:shadow-md transition-shadow">
        <Link href={`/dashboard/tasks/${task.id}`} className="font-medium text-sm hover:underline block mb-2">
          {task.title}
        </Link>
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <TaskPriorityBadge priority={task.priority} />
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>{task.assignees[0]?.name || '-'}</span>
            <span>·</span>
            <span>{task.projectTitle}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

function KanbanColumn({ status, tasks }: { status: TaskStatus; tasks: TaskListItem[] }) {
  return (
    <div className="flex flex-col w-72 shrink-0">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="font-semibold text-sm">{TASK_STATUS_DISPLAY[status]}</h3>
        <Badge variant="secondary" className="text-xs">{tasks.length}</Badge>
      </div>
      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2">
          {tasks.map((task) => (
            <KanbanCard key={task.id} task={task} />
          ))}
          {tasks.length === 0 && (
            <div className="flex items-center justify-center p-6 border border-dashed rounded-lg text-sm text-muted-foreground">
              No tasks
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

export default function KanbanPage() {
  const { data: allTasks, isLoading } = useTasks();
  const updateKanbanOrder = useUpdateKanbanOrder();
  const [activeTask, setActiveTask] = useState<TaskListItem | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const columns = useMemo(() => {
    return COLUMNS.map((status) => ({
      status,
      tasks: allTasks?.filter((t) => t.status === status) ?? [],
    }));
  }, [allTasks]);

  const handleDragStart = (event: DragStartEvent) => {
    const task = allTasks?.find((t) => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;
    if (activeId === overId) return;

    const activeTask = allTasks?.find((t) => t.id === activeId);
    if (!activeTask) return;

    // Determine target column
    let targetStatus: TaskStatus | null = null;
    const overInColumn = COLUMNS.find((col) => col === overId) as TaskStatus | undefined;
    if (overInColumn) {
      targetStatus = overInColumn;
    } else {
      const overTask = allTasks?.find((t) => t.id === overId);
      if (overTask) targetStatus = overTask.status;
    }

    if (!targetStatus) return;

    // Optimistic update via mutation
    updateKanbanOrder.mutate({
      id: activeId,
      status: targetStatus,
      sortOrder: 0,
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-10 w-48" />
        <div className="flex gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-72"><Skeleton className="h-64 w-full" /></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kanban Board</h1>
          <p className="text-muted-foreground">Drag and drop tasks to update their status.</p>
        </div>
        <Button render={<Link href="/dashboard/tasks" />} nativeButton={false} variant="outline">
          <List className="mr-2 h-4 w-4" />Table View
        </Button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((col) => (
            <KanbanColumn key={col.status} status={col.status} tasks={col.tasks} />
          ))}
        </div>

        <DragOverlay>
          {activeTask && (
            <Card className="p-3 shadow-lg w-72">
              <p className="font-medium text-sm">{activeTask.title}</p>
              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                <span>{activeTask.assignees[0]?.name || '-'}</span>
              </div>
            </Card>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
