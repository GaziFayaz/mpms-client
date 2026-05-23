'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Folder } from 'lucide-react';

const mockProjects = [
  { id: '1', title: 'Website Redesign', client: 'Acme Corp', status: 'In Progress', progress: 60, myTasks: { done: 5, total: 8 } },
  { id: '2', title: 'CRM Integration', client: 'Initech', status: 'In Progress', progress: 30, myTasks: { done: 2, total: 6 } },
  { id: '3', title: 'Mobile App MVP', client: 'Globex', status: 'Planning', progress: 5, myTasks: { done: 0, total: 4 } },
];

export default function UserProjectsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Projects</h1>
        <p className="text-muted-foreground">Projects you are involved in.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockProjects.map(project => (
          <Card key={project.id} className="flex flex-col">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">
                    <Link href={`/user/projects/${project.id}`} className="hover:underline">{project.title}</Link>
                  </CardTitle>
                  <CardDescription>{project.client}</CardDescription>
                </div>
                <Badge variant="outline">{project.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{project.progress}%</span>
                </div>
                <Progress value={project.progress} />
                <p className="text-xs text-muted-foreground mt-1">
                  Your tasks: {project.myTasks.done}/{project.myTasks.total} done
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
