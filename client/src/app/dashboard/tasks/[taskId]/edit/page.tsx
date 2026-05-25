'use client';

import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { FieldGroup, Field, FieldLabel, FieldError } from '@/components/ui/field';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTask, useUpdateTask } from '@/hooks/use-tasks';
import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

const editSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'review', 'done']),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
});

const statusOptions = [
  { label: 'To Do', value: 'todo' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Review', value: 'review' },
  { label: 'Done', value: 'done' },
];

const priorityOptions = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
  { label: 'Critical', value: 'critical' },
];

export default function EditTaskPage() {
  const params = useParams<{ taskId: string }>();
  const router = useRouter();
  const { data: task, isLoading } = useTask(params.taskId);
  const updateTask = useUpdateTask();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(editSchema),
    defaultValues: { title: '', status: 'todo' as const, priority: 'medium' as const },
  });

  const statusValue = watch('status');
  const priorityValue = watch('priority');

  useEffect(() => {
    if (task) {
      reset({ title: task.title, description: task.description || '', status: task.status, priority: task.priority });
    }
  }, [task, reset]);

  if (isLoading) return <div className="flex flex-col gap-6"><Skeleton className="h-10 w-64" /><Skeleton className="h-96 w-full" /></div>;
  if (!task) return <div className="text-center py-12 text-muted-foreground">Task not found.</div>;

  const onSubmit = async (data: Record<string, unknown>) => {
    await updateTask.mutateAsync({ id: task.id, ...data });
    router.push(`/dashboard/tasks/${task.id}`);
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
                      <SelectGroup>{statusOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel>Priority</FieldLabel>
                  <Select items={priorityOptions} value={priorityValue} onValueChange={(val: any) => setValue('priority', val)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectGroup>{priorityOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <div className="flex justify-end gap-4 mt-4">
                <Button render={<Link href={`/dashboard/tasks/${params.taskId}`} />} nativeButton={false} variant="outline">Cancel</Button>
                <Button type="submit" disabled={updateTask.isPending}>
                  {updateTask.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
