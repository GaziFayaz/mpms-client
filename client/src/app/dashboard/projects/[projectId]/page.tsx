'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useProject, useDeleteProject } from '@/hooks/use-projects';
import { useTasks } from '@/hooks/use-tasks';
import { useSprints, useCreateSprint, useUpdateSprint, useDeleteSprint, useReorderSprint } from '@/hooks/use-sprints';
import { ProjectStatusBadge } from '@/components/projects/project-status-badge';
import { TaskStatusBadge } from '@/components/tasks/task-status-badge';
import { TaskPriorityBadge } from '@/components/tasks/task-priority-badge';
import SprintForm from '@/components/sprints/sprint-form';
import { ArrowLeft, Edit, Trash, Plus, GripVertical } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { SprintListItem, TaskListItem, ProjectStats } from '@/types';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableSprintCard({
  sprint,
  stats,
  onEdit,
  onDelete,
}: {
  sprint: SprintListItem;
  stats: ProjectStats;
  onEdit: (sprint: SprintListItem) => void;
  onDelete: (sprint: SprintListItem) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: sprint.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 group"
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-muted-foreground" tabIndex={-1}>
          <GripVertical className="h-5 w-5" />
        </button>
        <Link href={`/dashboard/sprints/${sprint.id}`} className="flex-1 min-w-0">
          <p className="font-medium truncate">Sprint {sprint.sprintNumber}: {sprint.title}</p>
          <p className="text-xs text-muted-foreground">{formatDate(sprint.startDate)} - {formatDate(sprint.endDate)}</p>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <Progress value={stats.progress_percent} className="w-20" />
        <span className="text-sm text-muted-foreground whitespace-nowrap">{stats.completed_tasks}/{stats.total_tasks}</span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(sprint)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => onDelete(sprint)}>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ProjectDetailPage() {
  const params = useParams<{ projectId: string }>();
  const router = useRouter();
  const projectId = params.projectId;

  const { data: project, isLoading: projectLoading } = useProject(projectId);
  const { data: sprints, isLoading: sprintsLoading } = useSprints(projectId);
  const { data: tasksResponse, isLoading: tasksLoading } = useTasks({ project: projectId, limit: 100 });
  const createSprint = useCreateSprint();
  const updateSprint = useUpdateSprint();
  const deleteSprint = useDeleteSprint();
  const reorderSprint = useReorderSprint();
  const deleteProject = useDeleteProject();

  const [sprintModalOpen, setSprintModalOpen] = useState(false);
  const [editingSprint, setEditingSprint] = useState<SprintListItem | null>(null);
  const [activeSprint, setActiveSprint] = useState<SprintListItem | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const sortedSprints = useMemo(() => {
    if (!sprints) return [];
    return [...sprints].sort((a, b) => a.sortOrder - b.sortOrder);
  }, [sprints]);

  const sprintStatsMap = useMemo(() => {
    const tasks = tasksResponse?.data ?? [];
    const map = new Map<string, ProjectStats>();
    for (const sprint of sortedSprints) {
      const sprintTasks = tasks.filter((t: TaskListItem) => t.sprintId === sprint.id);
      const total = sprintTasks.length;
      const completed = sprintTasks.filter((t: TaskListItem) => t.status === 'done').length;
      map.set(sprint.id, {
        total_tasks: total,
        completed_tasks: completed,
        progress_percent: total > 0 ? Math.round((completed / total) * 100) : 0,
      });
    }
    return map;
  }, [sortedSprints, tasksResponse?.data]);

  const handleCreateSprint = () => {
    setEditingSprint(null);
    setSprintModalOpen(true);
  };

  const handleEditSprint = (sprint: SprintListItem) => {
    setEditingSprint(sprint);
    setSprintModalOpen(true);
  };

  const handleDeleteSprint = async (sprint: SprintListItem) => {
    if (!confirm(`Delete Sprint ${sprint.sprintNumber}: "${sprint.title}"?`)) return;
    await deleteSprint.mutateAsync({ id: sprint.id, projectId });
  };

  const handleSprintSubmit = async (data: { title: string; startDate: string; endDate: string }) => {
    if (editingSprint) {
      await updateSprint.mutateAsync({
        id: editingSprint.id,
        projectId,
        title: data.title,
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
      });
    } else {
      await createSprint.mutateAsync({
        projectId,
        title: data.title,
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
      });
    }
    setSprintModalOpen(false);
    setEditingSprint(null);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const sprint = sprints?.find((s) => s.id === event.active.id);
    if (sprint) setActiveSprint(sprint);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveSprint(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sortedSprints.findIndex((s) => s.id === active.id);
    const newIndex = sortedSprints.findIndex((s) => s.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = [...sortedSprints];
    const [removed] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, removed);

    reordered.forEach((s, i) => {
      const sprint = sprints?.find((sp) => sp.id === s.id);
      if (sprint && sprint.sortOrder !== i) {
        reorderSprint.mutate({ id: s.id, sortOrder: i, projectId });
      }
    });
  };

  const handleDeleteProjectAction = async () => {
    if (!confirm('Delete this project?')) return;
    await deleteProject.mutateAsync(projectId);
    router.push('/dashboard/projects');
  };

  if (projectLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!project) {
    return <div className="text-center py-12 text-muted-foreground">Project not found.</div>;
  }

  const projectTasks = tasksResponse?.data?.filter((t) => t.projectId === projectId) ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button render={<Link href="/dashboard/projects" />} nativeButton={false} variant="ghost" size="icon">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
          <p className="text-muted-foreground">{project.client}</p>
        </div>
        <ProjectStatusBadge status={project.status} />
        <Button render={<Link href={`/dashboard/projects/${projectId}/edit`} />} nativeButton={false} variant="outline">
          <Edit className="mr-2 h-4 w-4" />Edit
        </Button>
        <Button variant="destructive" onClick={handleDeleteProjectAction} disabled={deleteProject.isPending}>
          <Trash className="mr-2 h-4 w-4" />Delete
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <div className="text-3xl font-bold">{project.stats.progress_percent}%</div>
          <div className="text-sm text-muted-foreground">Progress</div>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <div className="text-3xl font-bold">{project.stats.completed_tasks}/{project.stats.total_tasks}</div>
          <div className="text-sm text-muted-foreground">Tasks</div>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <div className="text-3xl font-bold">{project.budget ? `$${Number(project.budget).toLocaleString()}` : '-'}</div>
          <div className="text-sm text-muted-foreground">Budget</div>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <div className="text-3xl font-bold">{sprints?.length ?? 0}</div>
          <div className="text-sm text-muted-foreground">Sprints</div>
        </Card>
      </div>

      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">Project Info</TabsTrigger>
          <TabsTrigger value="sprints">Sprints</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="mt-4">
          <Card>
            <CardContent className="pt-6 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Client</p>
                  <p className="font-medium">{project.client}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <ProjectStatusBadge status={project.status} />
                </div>
                <div>
                  <p className="text-muted-foreground">Start Date</p>
                  <p className="font-medium">{formatDate(project.startDate)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">End Date</p>
                  <p className="font-medium">{formatDate(project.endDate)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Budget</p>
                  <p className="font-medium">{project.budget ? `$${Number(project.budget).toLocaleString()}` : '-'}</p>
                </div>
              </div>
              {project.description && (
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Description</p>
                  <p className="text-sm">{project.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sprints" className="mt-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{sprints?.length ?? 0} sprints</p>
              <Button onClick={handleCreateSprint} size="sm">
                <Plus className="mr-2 h-4 w-4" />Create Sprint
              </Button>
            </div>
            {sprintsLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : !sortedSprints.length ? (
              <div className="text-center py-8 border rounded-lg border-dashed">
                <p className="text-muted-foreground">No sprints yet.</p>
              </div>
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                <SortableContext items={sortedSprints.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                  <div className="flex flex-col gap-2">
                    {sortedSprints.map((sprint) => (
                      <SortableSprintCard
                        key={sprint.id}
                        sprint={sprint}
                        stats={sprintStatsMap.get(sprint.id) ?? { total_tasks: 0, completed_tasks: 0, progress_percent: 0 }}
                        onEdit={handleEditSprint}
                        onDelete={handleDeleteSprint}
                      />
                    ))}
                  </div>
                </SortableContext>
                <DragOverlay>
                  {activeSprint && (
                    <div className="flex items-center gap-3 p-4 border rounded-lg bg-background shadow-lg">
                      <GripVertical className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Sprint {activeSprint.sprintNumber}: {activeSprint.title}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(activeSprint.startDate)} - {formatDate(activeSprint.endDate)}</p>
                      </div>
                    </div>
                  )}
                </DragOverlay>
              </DndContext>
            )}
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="mt-4">
          {tasksLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : !projectTasks.length ? (
            <div className="text-center py-8 border rounded-lg border-dashed">
              <p className="text-muted-foreground">No tasks for this project.</p>
            </div>
          ) : (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Sprint</TableHead>
                    <TableHead>Assignee</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projectTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">
                        <Link href={`/dashboard/tasks/${task.id}`} className="hover:underline">{task.title}</Link>
                      </TableCell>
                      <TableCell><TaskStatusBadge status={task.status} /></TableCell>
                      <TableCell><TaskPriorityBadge priority={task.priority} /></TableCell>
                      <TableCell>{task.sprintTitle || '-'}</TableCell>
                      <TableCell>{task.assignees.map((a) => a.name).join(', ')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="progress" className="mt-4">
          <Card>
            <CardContent className="pt-6 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Overall Progress</span>
                  <span className="font-medium">{project.stats.progress_percent}%</span>
                </div>
                <Progress value={project.stats.progress_percent} className="h-3" />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">{project.stats.completed_tasks}</div>
                  <div className="text-xs text-muted-foreground">Completed Tasks</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">{project.stats.total_tasks - project.stats.completed_tasks}</div>
                  <div className="text-xs text-muted-foreground">Remaining Tasks</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <SprintForm
        open={sprintModalOpen}
        onClose={() => {
          setSprintModalOpen(false);
          setEditingSprint(null);
        }}
        onSubmit={handleSprintSubmit}
        sprint={editingSprint}
        isPending={createSprint.isPending || updateSprint.isPending}
      />
    </div>
  );
}
