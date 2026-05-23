'use client';

import { Badge } from '@/components/ui/badge';

type Priority = 'Low' | 'Medium' | 'High' | 'Critical';

const PRIORITY_STYLES: Record<Priority, { className: string }> = {
  'Low': { className: 'border-slate-400 text-slate-600 dark:text-slate-400' },
  'Medium': { className: 'border-blue-500 text-blue-700 dark:text-blue-400' },
  'High': { className: 'border-orange-500 text-orange-700 dark:text-orange-400' },
  'Critical': { className: 'bg-red-100 border-red-500 text-red-700 dark:bg-red-950 dark:text-red-400' },
};

export function TaskPriorityBadge({ priority }: { priority: Priority }) {
  const style = PRIORITY_STYLES[priority] || PRIORITY_STYLES['Low'];
  return <Badge variant="outline" className={style.className}>{priority}</Badge>;
}
