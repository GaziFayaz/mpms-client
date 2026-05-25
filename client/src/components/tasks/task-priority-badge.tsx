'use client';

import { Badge } from '@/components/ui/badge';
import { PRIORITY_DISPLAY, type Priority } from '@/lib/constants';

const PRIORITY_COLORS: Record<Priority, string> = {
  low: 'border-slate-400 text-slate-600 dark:text-slate-400',
  medium: 'border-blue-500 text-blue-700 dark:text-blue-400',
  high: 'border-orange-500 text-orange-700 dark:text-orange-400',
  critical: 'bg-red-100 border-red-500 text-red-700 dark:bg-red-950 dark:text-red-400',
};

export function TaskPriorityBadge({ priority }: { priority: Priority }) {
  const display = PRIORITY_DISPLAY[priority] || priority;
  return <Badge variant="outline" className={PRIORITY_COLORS[priority]}>{display}</Badge>;
}
