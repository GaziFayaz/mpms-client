'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import Link from 'next/link';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FieldGroup, Field, FieldLabel, FieldError, FieldDescription } from '@/components/ui/field';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const projectSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  client: z.string().min(2, 'Client name is required'),
  description: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  budget: z.preprocess(
    (val) => (val === '' || val === undefined ? 0 : Number(val)),
    z.number().min(1, 'Budget must be greater than 0')
  ),
  status: z.enum(['Planning', 'In Progress', 'Completed']),
}).refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
  message: 'End date must be after start date',
  path: ['endDate'],
});

type ProjectValues = z.infer<typeof projectSchema>;

export default function CreateProjectPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      status: 'Planning',
      budget: 0,
    },
  });

  const statusValue = watch('status');

  const onSubmit = async (data: ProjectValues) => {
    setIsSubmitting(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.success('Project created successfully');
      router.push('/dashboard/projects');
    } catch (error) {
      toast.error('Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusOptions = [
    { label: "Planning", value: "Planning" },
    { label: "In Progress", value: "In Progress" },
    { label: "Completed", value: "Completed" },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Project</h1>
        <p className="text-muted-foreground">Add a new project to track its progress.</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup className="flex flex-col gap-4">
              <Field data-invalid={!!errors.title}>
                <FieldLabel htmlFor="title">Project Title</FieldLabel>
                <Input
                  id="title"
                  placeholder="e.g. Website Redesign"
                  aria-invalid={!!errors.title}
                  {...register('title')}
                />
                {errors.title && <FieldError>{errors.title.message}</FieldError>}
              </Field>

              <Field data-invalid={!!errors.client}>
                <FieldLabel htmlFor="client">Client Name</FieldLabel>
                <Input
                  id="client"
                  placeholder="e.g. Acme Corp"
                  aria-invalid={!!errors.client}
                  {...register('client')}
                />
                {errors.client && <FieldError>{errors.client.message}</FieldError>}
              </Field>

              <Field data-invalid={!!errors.description}>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Textarea
                  id="description"
                  placeholder="Brief description of the project..."
                  aria-invalid={!!errors.description}
                  {...register('description')}
                />
              </Field>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field data-invalid={!!errors.startDate}>
                  <FieldLabel htmlFor="startDate">Start Date</FieldLabel>
                  <Input
                    id="startDate"
                    type="date"
                    aria-invalid={!!errors.startDate}
                    {...register('startDate')}
                  />
                  {errors.startDate && <FieldError>{errors.startDate.message}</FieldError>}
                </Field>

                <Field data-invalid={!!errors.endDate}>
                  <FieldLabel htmlFor="endDate">End Date</FieldLabel>
                  <Input
                    id="endDate"
                    type="date"
                    aria-invalid={!!errors.endDate}
                    {...register('endDate')}
                  />
                  {errors.endDate && <FieldError>{errors.endDate.message}</FieldError>}
                </Field>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field data-invalid={!!errors.budget}>
                  <FieldLabel htmlFor="budget">Budget ($)</FieldLabel>
                  <Input
                    id="budget"
                    type="number"
                    min="0"
                    aria-invalid={!!errors.budget}
                    {...register('budget')}
                  />
                  {errors.budget && <FieldError>{errors.budget.message}</FieldError>}
                </Field>

                <Field data-invalid={!!errors.status}>
                  <FieldLabel>Status</FieldLabel>
                  <Select 
                    items={statusOptions}
                    value={statusValue} 
                    onValueChange={(val: any) => setValue('status', val)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {statusOptions.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {errors.status && <FieldError>{errors.status.message}</FieldError>}
                </Field>
              </div>

              <div className="flex gap-4 justify-end mt-4">
                <Button render={<Link href="/dashboard/projects" />} nativeButton={false} variant="outline">
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Project'}
                </Button>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
