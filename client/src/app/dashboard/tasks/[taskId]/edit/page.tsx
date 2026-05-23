'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import Link from 'next/link';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FieldGroup, Field, FieldLabel, FieldError } from '@/components/ui/field';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';

const editSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(['To Do', 'In Progress', 'Review', 'Done']),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical']),
  assignee: z.string().optional(),
  estimate: z.string().optional(),
  dueDate: z.string().optional(),
});

export default function EditTaskPage() {
  const params = useParams<{ taskId: string }>();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(editSchema),
    defaultValues: {
      title: 'Design Landing Page',
      description: 'Design a modern landing page for the website redesign.',
      status: 'In Progress' as const,
      priority: 'High' as const,
      assignee: 'Alice Chen',
      estimate: '8h',
      dueDate: '2026-06-15',
    },
  });

  const statusValue = watch('status');
  const priorityValue = watch('priority');

  const statusOptions = [
    { label: 'To Do', value: 'To Do' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Review', value: 'Review' },
    { label: 'Done', value: 'Done' },
  ];

  const priorityOptions = [
    { label: 'Low', value: 'Low' },
    { label: 'Medium', value: 'Medium' },
    { label: 'High', value: 'High' },
    { label: 'Critical', value: 'Critical' },
  ];

  const onSubmit = async () => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.success('Task updated successfully');
      router.push(`/dashboard/tasks/${params.taskId}`);
    } catch {
      toast.error('Failed to update task');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button render={<Link href={`/dashboard/tasks/${params.taskId}`} />} nativeButton={false} variant="ghost" size="icon">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Task</h1>
          <p className="text-muted-foreground">Update task details.</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup className="flex flex-col gap-6">
              <Field data-invalid={!!errors.title}>
                <FieldLabel htmlFor="title">Task Title</FieldLabel>
                <Input id="title" aria-invalid={!!errors.title} {...register('title')} />
                {errors.title && <FieldError>{errors.title.message}</FieldError>}
              </Field>

              <Field>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Textarea id="description" rows={5} {...register('description')} />
              </Field>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <Field>
                  <FieldLabel>Priority</FieldLabel>
                  <Select items={priorityOptions} value={priorityValue} onValueChange={(val: any) => setValue('priority', val)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {priorityOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="assignee">Assignee</FieldLabel>
                  <Input id="assignee" {...register('assignee')} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="estimate">Estimate</FieldLabel>
                  <Input id="estimate" placeholder="e.g. 8h" {...register('estimate')} />
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="dueDate">Due Date</FieldLabel>
                <Input id="dueDate" type="date" {...register('dueDate')} />
              </Field>

              <div className="flex justify-end gap-4 mt-4">
                <Button render={<Link href={`/dashboard/tasks/${params.taskId}`} />} nativeButton={false} variant="outline">
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
