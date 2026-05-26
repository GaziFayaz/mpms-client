'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useProject, useDeleteProject } from '@/hooks/use-projects';
import { useTasks } from '@/hooks/use-tasks';
import { useSprints } from '@/hooks/use-sprints';
import { ProjectStatusBadge } from '@/components/projects/project-status-badge';
import { TaskStatusBadge } from '@/components/tasks/task-status-badge';
import { TaskPriorityBadge } from '@/components/tasks/task-priority-badge';
import { ArrowLeft, Edit, Trash, Plus } from 'lucide-react';

export default function ProjectDetailPage() {
  const params = useParams<{ projectId: string }>();
  const router = useRouter();
  const projectId = params.projectId;

  const { data: project, isLoading: projectLoading } = useProject(projectId);
  const { data: sprints } = useSprints(projectId);
  const { data: tasks, isLoading: tasksLoading } = useTasks({ project: projectId });
  const deleteProject = useDeleteProject();

  const handleDelete = async () => {
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

  const projectTasks = tasks?.filter((t) => t.projectId === projectId) ?? [];

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
        <Button variant="destructive" onClick={handleDelete} disabled={deleteProject.isPending}>
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
                  <p className="font-medium">{project.startDate}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">End Date</p>
                  <p className="font-medium">{project.endDate}</p>
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
            </div>
            {!sprints?.length ? (
              <div className="text-center py-8 border rounded-lg border-dashed">
                <p className="text-muted-foreground">No sprints yet.</p>
              </div>
            ) : (
              sprints.map((sprint) => (
                <Link
                  key={sprint.id}
                  href={`/dashboard/sprints/${sprint.id}`}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                >
                  <div>
                    <p className="font-medium">Sprint {sprint.sprintNumber}: {sprint.title}</p>
                    <p className="text-xs text-muted-foreground">{sprint.startDate} - {sprint.endDate}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Progress value={sprint.stats?.progress_percent ?? 0} className="w-20" />
                    <span className="text-sm text-muted-foreground">{sprint.stats?.completed_tasks ?? 0}/{sprint.stats?.total_tasks ?? 0}</span>
                  </div>
                </Link>
              ))
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
    </div>
  );
}
