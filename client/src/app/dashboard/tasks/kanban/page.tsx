'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TaskStatusBadge } from '@/components/tasks/task-status-badge';
import { TaskPriorityBadge } from '@/components/tasks/task-priority-badge';
import { List } from 'lucide-react';
import {
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

interface Task {
  id: string;
  title: string;
  assignee: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  dueDate: string;
  status: 'To Do' | 'In Progress' | 'Review' | 'Done';
}

const COLUMNS: { id: Task['status']; title: string }[] = [
  { id: 'To Do', title: 'To Do' },
  { id: 'In Progress', title: 'In Progress' },
  { id: 'Review', title: 'Review' },
  { id: 'Done', title: 'Done' },
];

const initialTasks: Task[] = [
  { id: '1', title: 'Design landing page', assignee: 'Alice', priority: 'High', dueDate: 'Jun 15', status: 'In Progress' },
  { id: '2', title: 'Set up CI/CD', assignee: 'Bob', priority: 'Medium', dueDate: 'Jun 20', status: 'To Do' },
  { id: '3', title: 'Write API docs', assignee: 'Carol', priority: 'Low', dueDate: 'Jun 10', status: 'Done' },
  { id: '4', title: 'Review PRs', assignee: 'Dave', priority: 'High', dueDate: 'Jun 12', status: 'Review' },
  { id: '5', title: 'Fix payment bug', assignee: 'Eve', priority: 'Critical', dueDate: 'Jun 08', status: 'In Progress' },
  { id: '6', title: 'Update dependencies', assignee: 'Alice', priority: 'Low', dueDate: 'Jun 25', status: 'To Do' },
  { id: '7', title: 'Database backup', assignee: 'Bob', priority: 'Medium', dueDate: 'Jun 18', status: 'To Do' },
];

function KanbanCard({ task }: { task: Task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab active:cursor-grabbing"
    >
      <Card className="p-3 hover:shadow-md transition-shadow">
        <Link href={`/dashboard/tasks/${task.id}`} className="font-medium text-sm hover:underline block mb-2">
          {task.title}
        </Link>
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <TaskPriorityBadge priority={task.priority} />
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>{task.assignee}</span>
            <span>·</span>
            <span>{task.dueDate}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

function KanbanColumn({ column, tasks }: { column: { id: string; title: string }; tasks: Task[] }) {
  return (
    <div className="flex flex-col w-72 shrink-0">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="font-semibold text-sm">{column.title}</h3>
        <Badge variant="secondary" className="text-xs">{tasks.length}</Badge>
      </div>
      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2">
          {tasks.map(task => (
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
  const [tasks, setTasks] = useState(initialTasks);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  function findColumn(status: Task['status']) {
    return tasks.filter(t => t.status === status);
  }

  function handleDragStart(event: DragStartEvent) {
    const task = tasks.find(t => t.id === event.active.id);
    if (task) setActiveTask(task);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const activeTask = tasks.find(t => t.id === activeId);
    if (!activeTask) return;

    // Check if dropped on a column (no matching task id = column area)
    const overTask = tasks.find(t => t.id === overId);
    if (overTask) {
      // Dropped on another task - move to same status
      setTasks(prev => prev.map(t => t.id === activeId ? { ...t, status: overTask.status } : t));
    } else {
      // Dropped on a column container - check if overId is a column id
      const columnIds = COLUMNS.map(c => c.id);
      if (columnIds.includes(overId as Task['status'])) {
        setTasks(prev => prev.map(t => t.id === activeId ? { ...t, status: overId as Task['status'] } : t));
      }
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kanban Board</h1>
          <p className="text-muted-foreground">Drag and drop tasks to update their status.</p>
        </div>
        <Button render={<Link href="/dashboard/tasks" />} nativeButton={false} variant="outline">
          <List className="mr-2 h-4 w-4" />
          Table View
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {COLUMNS.map(col => (
            <KanbanColumn key={col.id} column={col} tasks={findColumn(col.id)} />
          ))}
        </div>

        <DragOverlay>
          {activeTask && (
            <Card className="p-3 shadow-lg w-72">
              <p className="font-medium text-sm">{activeTask.title}</p>
              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                <span>{activeTask.assignee}</span>
                <span>·</span>
                <span>{activeTask.dueDate}</span>
              </div>
            </Card>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
