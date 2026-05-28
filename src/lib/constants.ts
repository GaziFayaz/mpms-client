export const TASK_STATUSES = {
  TODO: 'todo' as const,
  IN_PROGRESS: 'in_progress' as const,
  REVIEW: 'review' as const,
  DONE: 'done' as const,
};

export type TaskStatus = (typeof TASK_STATUSES)[keyof typeof TASK_STATUSES];

export const TASK_STATUS_DISPLAY: Record<TaskStatus, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  review: 'Review',
  done: 'Done',
};

export const PRIORITIES = {
  LOW: 'low' as const,
  MEDIUM: 'medium' as const,
  HIGH: 'high' as const,
  CRITICAL: 'critical' as const,
};

export type Priority = (typeof PRIORITIES)[keyof typeof PRIORITIES];

export const PRIORITY_DISPLAY: Record<Priority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
};

export const PROJECT_STATUSES = {
  PLANNED: 'planned' as const,
  ACTIVE: 'active' as const,
  COMPLETED: 'completed' as const,
  ARCHIVED: 'archived' as const,
};

export type ProjectStatus = (typeof PROJECT_STATUSES)[keyof typeof PROJECT_STATUSES];

export const PROJECT_STATUS_DISPLAY: Record<ProjectStatus, string> = {
  planned: 'Planning',
  active: 'Active',
  completed: 'Completed',
  archived: 'Archived',
};

export const ROLES = {
  ADMIN: 'admin' as const,
  MANAGER: 'manager' as const,
  MEMBER: 'member' as const,
};

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

export const TASK_STATUS_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
  todo: ['in_progress'],
  in_progress: ['review', 'todo'],
  review: ['done', 'in_progress'],
  done: [],
};

export const ITEMS_PER_PAGE = 20;
export const SEARCH_DEBOUNCE_MS = 300;
