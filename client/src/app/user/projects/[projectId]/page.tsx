'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useProject } from '@/hooks/use-projects';
import { ProjectStatusBadge } from '@/components/projects/project-status-badge';
import { ArrowLeft, ChevronDown } from 'lucide-react';

export default function UserProjectDetailPage() {
  const params = useParams<{ projectId: string }>();
  const { data: project, isLoading } = useProject(params.projectId);

  if (isLoading) {
    return <div className="flex flex-col gap-6"><Skeleton className="h-10 w-64" /><Skeleton className="h-96 w-full" /></div>;
  }

  if (!project) {
    return <div className="text-center py-12 text-muted-foreground">Project not found.</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button render={<Link href="/user/projects" />} nativeButton={false} variant="ghost" size="icon">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
          <p className="text-muted-foreground">{project.client} · {project.startDate} to {project.endDate}</p>
        </div>
        <ProjectStatusBadge status={project.status} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <div className="text-3xl font-bold">{project.stats.progress_percent}%</div>
          <div className="text-sm text-muted-foreground">Project Progress</div>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <div className="text-3xl font-bold">{project.stats.completed_tasks}/{project.stats.total_tasks}</div>
          <div className="text-sm text-muted-foreground">Tasks Done</div>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <div className="text-3xl font-bold">{project.budget ? `$${Number(project.budget).toLocaleString()}` : '-'}</div>
          <div className="text-sm text-muted-foreground">Budget</div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sprints</CardTitle>
          <CardDescription>View your tasks within each sprint</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {project.sprints.map((sprint) => (
            <Link
              key={sprint.id}
              href={`/user/projects/${params.projectId}/sprints/${sprint.id}`}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
            >
              <div>
                <p className="font-medium">Sprint {sprint.sprintNumber}: {sprint.title}</p>
                <p className="text-xs text-muted-foreground">{sprint.startDate} - {sprint.endDate}</p>
              </div>
              <div className="flex items-center gap-4">
                <Progress value={sprint.stats?.progress_percent ?? 0} className="w-20" />
                <span className="text-sm text-muted-foreground">{sprint.stats?.completed_tasks ?? 0}/{sprint.stats?.total_tasks ?? 0}</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
