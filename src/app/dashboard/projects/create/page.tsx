'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FieldGroup, Field, FieldLabel, FieldError } from '@/components/ui/field';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateProject } from '@/hooks/use-projects';
import { PROJECT_STATUSES } from '@/lib/constants';

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

export default function CreateProjectPage() {
  const router = useRouter();
  const createProject = useCreateProject();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: { status: 'planned' as const },
  });

  const statusValue = watch('status');

  const statusOptions = [
    { label: 'Planning', value: 'planned' },
    { label: 'Active', value: 'active' },
    { label: 'Completed', value: 'completed' },
  ];

  const onSubmit = async (data: Record<string, unknown>) => {
    await createProject.mutateAsync(data);
    router.push('/dashboard/projects');
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Project</h1>
        <p className="text-muted-foreground">Add a new project to your workspace.</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="pt-6">
            <FieldGroup className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field data-invalid={!!errors.title}>
                  <FieldLabel htmlFor="title">Project Title <span className="text-destructive">*</span></FieldLabel>
                  <Input id="title" aria-invalid={!!errors.title} {...register('title')} />
                  {errors.title && <FieldError>{errors.title.message}</FieldError>}
                </Field>
                <Field data-invalid={!!errors.client}>
                  <FieldLabel htmlFor="client">Client <span className="text-destructive">*</span></FieldLabel>
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
                  <FieldLabel htmlFor="startDate">Start Date <span className="text-destructive">*</span></FieldLabel>
                  <Input id="startDate" type="date" aria-invalid={!!errors.startDate} {...register('startDate')} />
                  {errors.startDate && <FieldError>{errors.startDate.message}</FieldError>}
                </Field>
                <Field data-invalid={!!errors.endDate}>
                  <FieldLabel htmlFor="endDate">End Date <span className="text-destructive">*</span></FieldLabel>
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
            <Button render={<Link href="/dashboard/projects" />} nativeButton={false} variant="ghost">Cancel</Button>
            <Button type="submit" disabled={createProject.isPending}>
              {createProject.isPending ? 'Creating...' : 'Create Project'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
