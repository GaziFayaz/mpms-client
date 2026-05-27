'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FieldGroup, Field, FieldLabel, FieldError } from '@/components/ui/field';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Dialog from '@/components/ui/dialog';
import { useTeam } from '@/hooks/use-team';
import { useSprints } from '@/hooks/use-sprints';
import { useProjects } from '@/hooks/use-projects';
import { X, Check } from 'lucide-react';
import type { TaskDetail, UserListItem, SprintListItem } from '@/types';

const taskSchema = z.object({
  sprintId: z.string().min(1, 'Sprint is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  estimateHours: z.number().positive('Must be positive').optional().nullable(),
  dueDate: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'review', 'done']).optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface SubmitData extends TaskFormData {
  assigneeIds: string[];
}

const priorityOptions = [
  { label: 'Low', value: 'low' as const },
  { label: 'Medium', value: 'medium' as const },
  { label: 'High', value: 'high' as const },
  { label: 'Critical', value: 'critical' as const },
];

const statusOptions = [
  { label: 'To Do', value: 'todo' as const },
  { label: 'In Progress', value: 'in_progress' as const },
  { label: 'Review', value: 'review' as const },
  { label: 'Done', value: 'done' as const },
];

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: SubmitData) => Promise<void>;
  task?: TaskDetail | null;
  isPending?: boolean;
  defaultSprintId?: string;
  inline?: boolean;
}

function safeSet(fn: (val: string) => void) {
  return (val: string | null) => { if (val) fn(val); };
}

export default function TaskForm({ open, onClose, onSubmit, task, isPending, defaultSprintId, inline }: TaskFormProps) {
  const isEdit = !!task;
  const { data: teamMembers } = useTeam();
  const { data: projects } = useProjects();
  const [sprintProjectId, setSprintProjectId] = useState<string | null>(null);
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: { sprintId: defaultSprintId || '', title: '', status: 'todo' },
  });

  const sprintId = watch('sprintId');
  const priorityValue = watch('priority');
  const statusValue = watch('status');

  const { data: sprints } = useSprints(sprintProjectId || '');

  useEffect(() => {
    if (task) {
      const dueDate = task.dueDate ? task.dueDate.split('T')[0] : '';
      reset({
        sprintId: task.sprintId || '',
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        estimateHours: task.estimateHours ? Number(task.estimateHours) : null,
        dueDate,
        status: task.status,
      });
      setSprintProjectId(task.projectId);
      setSelectedAssignees(task.assignees.map((a) => a.id));
    } else {
      reset({
        sprintId: defaultSprintId || '',
        title: '',
        description: '',
        priority: 'medium',
        estimateHours: null,
        dueDate: '',
        status: 'todo',
      });
      setSelectedAssignees([]);
    }
  }, [task, reset, defaultSprintId, open]);

  const membersList = useMemo(() => {
    if (!teamMembers) return [];
    return Array.isArray(teamMembers) ? teamMembers : [];
  }, [teamMembers]);

  const sprintsList = useMemo(() => {
    if (!sprints) return [];
    return Array.isArray(sprints) ? sprints : [];
  }, [sprints]);

  const handleSprintChange = (val: string) => {
    setValue('sprintId', val);
    const selectedSprint = sprintsList?.find((s: SprintListItem) => s.id === val);
    if (selectedSprint) {
      setSprintProjectId(selectedSprint.projectId);
    }
  };

  const toggleAssignee = (userId: string) => {
    setSelectedAssignees((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleFormSubmit: SubmitHandler<TaskFormData> = async (data) => {
    await onSubmit({ ...data, assigneeIds: selectedAssignees });
  };

  const formContent = (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <FieldGroup className="flex flex-col gap-4">
        <Field data-invalid={!!errors.sprintId}>
          <FieldLabel>Sprint</FieldLabel>
          <Select value={sprintId} onValueChange={safeSet(handleSprintChange)}>
            <SelectTrigger><span>{sprintId ? (sprintsList?.find((s: SprintListItem) => s.id === sprintId) ? `Sprint ${(sprintsList.find((s: SprintListItem) => s.id === sprintId) as SprintListItem).sprintNumber}` : 'Select sprint') : 'Select a sprint'}</span></SelectTrigger>
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
          <FieldLabel htmlFor="task-title">Title</FieldLabel>
          <Input id="task-title" aria-invalid={!!errors.title} {...register('title')} placeholder="Task title" />
          {errors.title && <FieldError>{errors.title.message}</FieldError>}
        </Field>

        <Field>
          <FieldLabel htmlFor="task-desc">Description</FieldLabel>
          <Textarea id="task-desc" rows={4} {...register('description')} placeholder="Task description" />
        </Field>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field>
            <FieldLabel>Priority</FieldLabel>
            <Select value={priorityValue || ''} onValueChange={safeSet((v) => setValue('priority', v as TaskFormData['priority']))}>
              <SelectTrigger><span>{priorityValue ? priorityOptions.find(o => o.value === priorityValue)?.label : 'Medium'}</span></SelectTrigger>
              <SelectContent>
                <SelectGroup>{priorityOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectGroup>
              </SelectContent>
            </Select>
          </Field>

          <Field data-invalid={!!errors.estimateHours}>
            <FieldLabel htmlFor="task-estimate">Estimate (hours)</FieldLabel>
            <Input id="task-estimate" type="number" step="0.5" min="0" aria-invalid={!!errors.estimateHours} {...register('estimateHours', { valueAsNumber: true })} placeholder="e.g. 4" />
            {errors.estimateHours && <FieldError>{errors.estimateHours.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel htmlFor="task-due">Due Date</FieldLabel>
            <Input id="task-due" type="date" {...register('dueDate')} />
          </Field>
        </div>

        {isEdit && (
          <Field>
            <FieldLabel>Status</FieldLabel>
            <Select value={statusValue || 'todo'} onValueChange={safeSet((v) => setValue('status', v as TaskFormData['status']))}>
              <SelectTrigger><span>{statusValue ? statusOptions.find(o => o.value === statusValue)?.label : 'Select'}</span></SelectTrigger>
              <SelectContent>
                <SelectGroup>{statusOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        )}

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

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Saving...' : isEdit ? 'Update Task' : 'Create Task'}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );

  if (inline) {
    return formContent;
  }

  return (
    <Dialog open={open} onClose={onClose} title={isEdit ? 'Edit Task' : 'Create Task'} className="max-w-2xl">
      {formContent}
    </Dialog>
  );
}
