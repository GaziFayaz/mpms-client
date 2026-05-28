'use client';

import { useEffect, useMemo, useState } from 'react';
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
import { useTeam } from '@/hooks/use-team';
import { useSprints } from '@/hooks/use-sprints';
import { ArrowLeft, X, Check } from 'lucide-react';
import type { UserListItem, SprintListItem, TaskStatus, Priority } from '@/types';

const editSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  sprintId: z.string().min(1, 'Sprint is required'),
  status: z.enum(['todo', 'in_progress', 'review', 'done']),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  estimateHours: z.number().positive('Must be positive').optional().nullable(),
  dueDate: z.string().optional(),
});

type EditFormData = z.infer<typeof editSchema>;

const statusOptions = [
  { label: 'To Do', value: 'todo' as const },
  { label: 'In Progress', value: 'in_progress' as const },
  { label: 'Review', value: 'review' as const },
  { label: 'Done', value: 'done' as const },
];

const priorityOptions = [
  { label: 'Low', value: 'low' as const },
  { label: 'Medium', value: 'medium' as const },
  { label: 'High', value: 'high' as const },
  { label: 'Critical', value: 'critical' as const },
];

function safeSet(fn: (val: string) => void) {
  return (val: string | null) => { if (val) fn(val); };
}

export default function EditTaskPage() {
  const params = useParams<{ taskId: string }>();
  const router = useRouter();
  const { data: task, isLoading } = useTask(params.taskId);
  const updateTask = useUpdateTask();
  const { data: teamMembers } = useTeam();
  const { data: sprints } = useSprints(task?.projectId);

  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<EditFormData>({
    resolver: zodResolver(editSchema),
    defaultValues: { title: '', sprintId: '', status: 'todo', priority: 'medium' },
  });

  const statusValue = watch('status');
  const priorityValue = watch('priority');
  const sprintId = watch('sprintId');

  useEffect(() => {
    if (task) {
      const dueDate = task.dueDate ? task.dueDate.split('T')[0] : '';
      reset({
        title: task.title,
        description: task.description || '',
        sprintId: task.sprintId || '',
        status: task.status,
        priority: task.priority,
        estimateHours: task.estimateHours ? Number(task.estimateHours) : null,
        dueDate,
      });
      setSelectedAssignees(task.assignees.map((a) => a.id));
    }
  }, [task, reset]);

  const membersList = useMemo(() => {
    if (!teamMembers) return [];
    return Array.isArray(teamMembers) ? teamMembers : [];
  }, [teamMembers]);

  const sprintsList = useMemo(() => {
    if (!sprints) return [];
    return Array.isArray(sprints) ? sprints : [];
  }, [sprints]);

  const toggleAssignee = (userId: string) => {
    setSelectedAssignees((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  if (isLoading) return <div className="flex flex-col gap-6"><Skeleton className="h-10 w-64" /><Skeleton className="h-96 w-full" /></div>;
  if (!task) return <div className="text-center py-12 text-muted-foreground">Task not found.</div>;

  const onSubmit = async (data: EditFormData) => {
    await updateTask.mutateAsync({
      id: task.id,
      ...data,
      estimateHours: data.estimateHours || undefined,
      assigneeIds: selectedAssignees,
    });
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
              <Field data-invalid={!!errors.sprintId}>
                <FieldLabel>Sprint</FieldLabel>
                <Select value={sprintId} onValueChange={safeSet((v) => setValue('sprintId', v))}>
                  <SelectTrigger><span>{sprintId ? (sprintsList?.find((s: SprintListItem) => s.id === sprintId) ? `Sprint ${(sprintsList.find((s: SprintListItem) => s.id === sprintId) as SprintListItem).sprintNumber}` : 'Select sprint') : 'Select sprint'}</span></SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {sprintsList?.map((s: SprintListItem) => (
                        <SelectItem key={s.id} value={s.id}>Sprint {s.sprintNumber}: {s.title}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.sprintId && <FieldError>{errors.sprintId.message}</FieldError>}
              </Field>

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
                  <Select value={statusValue} onValueChange={safeSet((v) => setValue('status', v as TaskStatus))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectGroup>{statusOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel>Priority</FieldLabel>
                  <Select value={priorityValue} onValueChange={safeSet((v) => setValue('priority', v as Priority))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectGroup>{priorityOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field data-invalid={!!errors.estimateHours}>
                  <FieldLabel htmlFor="estimate">Estimate (hours)</FieldLabel>
                  <Input id="estimate" type="number" step="0.5" min="0" aria-invalid={!!errors.estimateHours} {...register('estimateHours', { valueAsNumber: true })} placeholder="e.g. 4" />
                  {errors.estimateHours && <FieldError>{errors.estimateHours.message}</FieldError>}
                </Field>
                <Field>
                  <FieldLabel htmlFor="dueDate">Due Date</FieldLabel>
                  <Input id="dueDate" type="date" {...register('dueDate')} />
                </Field>
              </div>

              <Field>
                <FieldLabel>Assignees</FieldLabel>
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedAssignees.map((id) => {
                    const member = membersList.find((m: UserListItem) => m.id === id);
                    return (
                      <span key={id} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-sm">
                        {member?.name || id}
                        <button type="button" onClick={() => toggleAssignee(id)} className="hover:text-destructive">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    );
                  })}
                </div>
                <div className="max-h-32 overflow-y-auto border rounded-md">
                  {membersList.map((member: UserListItem) => (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => toggleAssignee(member.id)}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted text-left"
                    >
                      <div className={`size-4 rounded border flex items-center justify-center ${
                        selectedAssignees.includes(member.id) ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground/30'
                      }`}>
                        {selectedAssignees.includes(member.id) && <Check className="size-3" />}
                      </div>
                      <span>{member.name}</span>
                      <span className="text-xs text-muted-foreground ml-auto">{member.role}</span>
                    </button>
                  ))}
                </div>
              </Field>

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
