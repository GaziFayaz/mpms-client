'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useProjects } from '@/hooks/use-projects';
import { useAuthStore } from '@/hooks/use-auth';
import { ProjectStatusBadge } from '@/components/projects/project-status-badge';

export default function UserProjectsPage() {
  const { data: projects, isLoading } = useProjects();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold">My Projects</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Projects</h1>
        <p className="text-muted-foreground">Projects you are involved in.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects?.map((project) => (
          <Card key={project.id} className="flex flex-col">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">
                    <Link href={`/user/projects/${project.id}`} className="hover:underline">{project.title}</Link>
                  </CardTitle>
                  <CardDescription>{project.client}</CardDescription>
                </div>
                <ProjectStatusBadge status={project.status} />
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{project.stats.progress_percent}%</span>
                </div>
                <Progress value={project.stats.progress_percent} />
                <p className="text-xs text-muted-foreground mt-1">
                  {project.stats.completed_tasks} / {project.stats.total_tasks} tasks done
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
        {!projects?.length && (
          <p className="text-muted-foreground col-span-full text-center py-8">No projects found.</p>
        )}
      </div>
    </div>
  );
}
