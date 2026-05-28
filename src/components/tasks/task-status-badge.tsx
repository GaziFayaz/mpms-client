'use client';

import { Badge } from '@/components/ui/badge';
import { TASK_STATUS_DISPLAY, type TaskStatus } from '@/lib/constants';

const STATUS_COLORS: Record<TaskStatus, string> = {
  todo: 'border-slate-400 text-slate-700 dark:text-slate-400',
  in_progress: '',
  review: 'border-amber-500 text-amber-700 dark:text-amber-400',
  done: 'border-green-500 text-green-700 dark:text-green-400',
};

const STATUS_VARIANTS: Record<TaskStatus, 'default' | 'secondary' | 'outline'> = {
  todo: 'secondary',
  in_progress: 'default',
  review: 'outline',
  done: 'outline',
};

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  const display = TASK_STATUS_DISPLAY[status] || status;
  return (
    <Badge variant={STATUS_VARIANTS[status] || 'outline'} className={STATUS_COLORS[status]}>
      {display}
    </Badge>
  );
}
