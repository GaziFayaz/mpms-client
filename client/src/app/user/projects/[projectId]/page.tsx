'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ChevronDown } from 'lucide-react';

const sprints = [
  { id: '1', number: 1, title: 'Initial Setup', tasks: 6, done: 4, start: 'May 20', end: 'Jun 3' },
  { id: '2', number: 2, title: 'Core Pages', tasks: 8, done: 1, start: 'Jun 4', end: 'Jun 17' },
];

export default function UserProjectDetailPage() {
  const params = useParams<{ projectId: string }>();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button render={<Link href="/user/projects" />} nativeButton={false} variant="ghost" size="icon">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Website Redesign</h1>
          <p className="text-muted-foreground">Acme Corp · Jun 1 - Aug 30, 2026</p>
        </div>
        <Badge variant="default" className="ml-auto">In Progress</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <div className="text-3xl font-bold">{'60%'}</div>
          <div className="text-sm text-muted-foreground">Project Progress</div>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <div className="text-3xl font-bold">5/8</div>
          <div className="text-sm text-muted-foreground">Your Tasks Done</div>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <div className="text-3xl font-bold">$15,000</div>
          <div className="text-sm text-muted-foreground">Budget</div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sprints</CardTitle>
          <CardDescription>Expand a sprint to see your tasks</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {sprints.map(sprint => (
            <div key={sprint.id} className="border rounded-lg">
              <Link 
                href={`/user/projects/${params.projectId}/sprints/${sprint.id}`}
                className="flex items-center justify-between p-4 hover:bg-muted/50"
              >
                <div>
                  <p className="font-medium">Sprint {sprint.number}: {sprint.title}</p>
                  <p className="text-xs text-muted-foreground">{sprint.start} - {sprint.end}</p>
                </div>
                <div className="flex items-center gap-4">
                  <Progress value={(sprint.done / sprint.tasks) * 100} className="w-20" />
                  <span className="text-sm text-muted-foreground">{sprint.done}/{sprint.tasks}</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
