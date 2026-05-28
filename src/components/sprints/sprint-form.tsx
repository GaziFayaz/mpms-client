'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FieldGroup, Field, FieldLabel, FieldError } from '@/components/ui/field';
import Dialog from '@/components/ui/dialog';
import type { SprintListItem } from '@/types';

const sprintSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
});

type SprintFormData = z.infer<typeof sprintSchema>;

interface SprintFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: SprintFormData) => Promise<void>;
  sprint?: SprintListItem | null;
  isPending?: boolean;
}

export default function SprintForm({ open, onClose, onSubmit, sprint, isPending }: SprintFormProps) {
  const isEdit = !!sprint;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SprintFormData>({
    resolver: zodResolver(sprintSchema),
    defaultValues: { title: '', startDate: '', endDate: '' },
  });

  useEffect(() => {
    if (sprint) {
      const startDate = sprint.startDate ? sprint.startDate.split('T')[0] : '';
      const endDate = sprint.endDate ? sprint.endDate.split('T')[0] : '';
      reset({ title: sprint.title, startDate, endDate });
    } else {
      reset({ title: '', startDate: '', endDate: '' });
    }
  }, [sprint, reset, open]);

  const handleFormSubmit = async (data: SprintFormData) => {
    await onSubmit(data);
  };

  return (
    <Dialog open={open} onClose={onClose} title={isEdit ? 'Edit Sprint' : 'Create Sprint'}>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <FieldGroup className="flex flex-col gap-4">
          <Field data-invalid={!!errors.title}>
            <FieldLabel htmlFor="sprint-title">Title</FieldLabel>
            <Input id="sprint-title" aria-invalid={!!errors.title} {...register('title')} placeholder="Sprint title" />
            {errors.title && <FieldError>{errors.title.message}</FieldError>}
          </Field>

          <Field data-invalid={!!errors.startDate}>
            <FieldLabel htmlFor="sprint-start">Start Date</FieldLabel>
            <Input id="sprint-start" type="date" aria-invalid={!!errors.startDate} {...register('startDate')} />
            {errors.startDate && <FieldError>{errors.startDate.message}</FieldError>}
          </Field>

          <Field data-invalid={!!errors.endDate}>
            <FieldLabel htmlFor="sprint-end">End Date</FieldLabel>
            <Input id="sprint-end" type="date" aria-invalid={!!errors.endDate} {...register('endDate')} />
            {errors.endDate && <FieldError>{errors.endDate.message}</FieldError>}
          </Field>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Saving...' : isEdit ? 'Update Sprint' : 'Create Sprint'}
            </Button>
          </div>
        </FieldGroup>
      </form>
    </Dialog>
  );
}
