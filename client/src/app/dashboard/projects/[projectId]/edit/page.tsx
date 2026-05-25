'use client';

import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { FieldGroup, Field, FieldLabel, FieldError } from '@/components/ui/field';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProject, useUpdateProject } from '@/hooks/use-projects';

const projectSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  client: z.string().min(2, 'Client name is required'),
  description: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  budget: z.preprocess((val) => (val === '' || val === undefined ? undefined : Number(val)), z.number().min(0).optional()),
  status: z.enum(['planned', 'active', 'completed', 'archived']),
}).refine((data) => !data.endDate || !data.startDate || new Date(data.endDate) >= new Date(data.startDate), {
  message: 'End date must be after start date',
  path: ['endDate'],
});

const statusOptions = [
  { label: 'Planning', value: 'planned' },
  { label: 'Active', value: 'active' },
  { label: 'Completed', value: 'completed' },
  { label: 'Archived', value: 'archived' },
];

export default function EditProjectPage() {
  const params = useParams<{ projectId: string }>();
  const router = useRouter();
  const projectId = params.projectId;

  const { data: project, isLoading } = useProject(projectId);
  const updateProject = useUpdateProject();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: { title: '', client: '', startDate: '', endDate: '', status: 'planned' as const },
  });

  const statusValue = watch('status');

  useEffect(() => {
    if (project) {
      reset({
        title: project.title,
        client: project.client,
        description: project.description || '',
        startDate: project.startDate?.split('T')[0] || '',
        endDate: project.endDate?.split('T')[0] || '',
        budget: project.budget ? Number(project.budget) : undefined,
        status: project.status,
      });
    }
  }, [project, reset]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!project) {
    return <div className="text-center py-12 text-muted-foreground">Project not found.</div>;
  }

  const onSubmit = async (data: Record<string, unknown>) => {
    await updateProject.mutateAsync({ id: projectId, ...data });
    router.push(`/dashboard/projects/${projectId}`);
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Project</h1>
        <p className="text-muted-foreground">Update project details.</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="pt-6">
            <FieldGroup className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field data-invalid={!!errors.title}>
                  <FieldLabel htmlFor="title">Project Title</FieldLabel>
                  <Input id="title" aria-invalid={!!errors.title} {...register('title')} />
                  {errors.title && <FieldError>{errors.title.message}</FieldError>}
                </Field>
                <Field data-invalid={!!errors.client}>
                  <FieldLabel htmlFor="client">Client</FieldLabel>
                  <Input id="client" aria-invalid={!!errors.client} {...register('client')} />
                  {errors.client && <FieldError>{errors.client.message}</FieldError>}
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Textarea id="description" rows={4} {...register('description')} />
              </Field>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field data-invalid={!!errors.startDate}>
                  <FieldLabel htmlFor="startDate">Start Date</FieldLabel>
                  <Input id="startDate" type="date" aria-invalid={!!errors.startDate} {...register('startDate')} />
                  {errors.startDate && <FieldError>{errors.startDate.message}</FieldError>}
                </Field>
                <Field data-invalid={!!errors.endDate}>
                  <FieldLabel htmlFor="endDate">End Date</FieldLabel>
                  <Input id="endDate" type="date" aria-invalid={!!errors.endDate} {...register('endDate')} />
                  {errors.endDate && <FieldError>{errors.endDate.message}</FieldError>}
                </Field>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field>
                  <FieldLabel htmlFor="budget">Budget ($)</FieldLabel>
                  <Input id="budget" type="number" min="0" step="100" {...register('budget')} />
                </Field>
                <Field>
                  <FieldLabel>Status</FieldLabel>
                  <Select items={statusOptions} value={statusValue} onValueChange={(val: any) => setValue('status', val)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {statusOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            </FieldGroup>
          </CardContent>
          <CardFooter className="flex justify-between border-t py-4">
            <Button render={<Link href={`/dashboard/projects/${projectId}`} />} nativeButton={false} variant="ghost">Cancel</Button>
            <Button type="submit" disabled={updateProject.isPending}>
              {updateProject.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
