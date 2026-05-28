'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { useProjects } from '@/hooks/use-projects';
import { ProjectStatusBadge } from '@/components/projects/project-status-badge';
import { Search, Plus, LayoutGrid, List } from 'lucide-react';

export default function ProjectsPage() {
  const [search, setSearch] = useState('');
  const { data: projects, isLoading } = useProjects();

  const filtered = projects?.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.client.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-36" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2"><Skeleton className="h-5 w-32" /></CardHeader>
              <CardContent><Skeleton className="h-4 w-full mb-2" /><Skeleton className="h-2 w-full" /></CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Manage and track your client projects.</p>
        </div>
        <Button render={<Link href="/dashboard/projects/create" />} nativeButton={false}>
          <Plus className="mr-2 h-4 w-4" />
          Create Project
        </Button>
      </div>

      <Tabs defaultValue="grid">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search projects..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <TabsList>
            <TabsTrigger value="grid"><LayoutGrid className="mr-2 h-4 w-4" />Grid</TabsTrigger>
            <TabsTrigger value="table"><List className="mr-2 h-4 w-4" />Table</TabsTrigger>
          </TabsList>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 mt-4 border rounded-lg border-dashed bg-muted/20">
            <h3 className="text-lg font-medium">No projects found</h3>
            <p className="text-muted-foreground mb-4">Create a new project to get started.</p>
            <Button render={<Link href="/dashboard/projects/create" />} nativeButton={false}>Create Project</Button>
          </div>
        ) : (
          <>
            <TabsContent value="grid" className="mt-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filtered.map((project) => (
                  <Card key={project.id} className="flex flex-col">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            <Link href={`/dashboard/projects/${project.id}`} className="hover:underline">
                              {project.title}
                            </Link>
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">{project.client}</p>
                        </div>
                        <ProjectStatusBadge status={project.status} />
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 pb-2">
                      <div className="mt-4 space-y-2 flex flex-col gap-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{project.stats.progress_percent}%</span>
                        </div>
                        <Progress value={project.stats.progress_percent} />
                        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                          <span>{project.stats.completed_tasks} / {project.stats.total_tasks} tasks</span>
                          <span>{project.budget ? `$${Number(project.budget).toLocaleString()}` : '-'}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2">
                      <Button render={<Link href={`/dashboard/projects/${project.id}`} />} nativeButton={false} variant="outline" className="w-full">
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="table" className="mt-4">
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium">{project.title}</TableCell>
                        <TableCell>{project.client}</TableCell>
                        <TableCell><ProjectStatusBadge status={project.status} /></TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={project.stats.progress_percent} className="w-[60px]" />
                            <span className="text-xs text-muted-foreground">{project.stats.progress_percent}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button render={<Link href={`/dashboard/projects/${project.id}`} />} nativeButton={false} variant="ghost" size="sm">View</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}
