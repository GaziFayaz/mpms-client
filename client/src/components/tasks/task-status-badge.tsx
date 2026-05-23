'use client';

import { Badge } from '@/components/ui/badge';

type TaskStatus = 'To Do' | 'In Progress' | 'Review' | 'Done';

const STATUS_STYLES: Record<TaskStatus, { variant: 'default' | 'secondary' | 'outline'; className: string }> = {
  'To Do': { variant: 'secondary', className: '' },
  'In Progress': { variant: 'default', className: '' },
  'Review': { variant: 'outline', className: 'border-amber-500 text-amber-700 dark:text-amber-400' },
  'Done': { variant: 'outline', className: 'border-green-500 text-green-700 dark:text-green-400' },
};

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES['To Do'];
  return <Badge variant={style.variant} className={style.className}>{status}</Badge>;
}
