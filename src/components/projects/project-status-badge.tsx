'use client';

import { Badge } from '@/components/ui/badge';
import { PROJECT_STATUS_DISPLAY, type ProjectStatus } from '@/lib/constants';

const STATUS_VARIANTS: Record<ProjectStatus, 'default' | 'secondary' | 'outline'> = {
  planned: 'secondary',
  active: 'default',
  completed: 'outline',
  archived: 'outline',
};

const STATUS_COLORS: Record<ProjectStatus, string> = {
  planned: '',
  active: '',
  completed: 'border-green-500 text-green-700 dark:text-green-400',
  archived: 'border-slate-400 text-slate-600 dark:text-slate-400',
};

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  const display = PROJECT_STATUS_DISPLAY[status] || status;
  return (
    <Badge variant={STATUS_VARIANTS[status] || 'outline'} className={STATUS_COLORS[status]}>
      {display}
    </Badge>
  );
}
