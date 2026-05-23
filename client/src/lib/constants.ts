export const TASK_STATUSES = {
  TODO: 'To Do' as const,
  IN_PROGRESS: 'In Progress' as const,
  REVIEW: 'Review' as const,
  DONE: 'Done' as const,
};

export const PRIORITIES = {
  LOW: 'Low' as const,
  MEDIUM: 'Medium' as const,
  HIGH: 'High' as const,
  CRITICAL: 'Critical' as const,
};

export const ROLES = {
  ADMIN: 'admin' as const,
  MANAGER: 'manager' as const,
  MEMBER: 'member' as const,
};

export const TASK_STATUS_TRANSITIONS: Record<string, string[]> = {
  'To Do': ['In Progress'],
  'In Progress': ['Review', 'To Do'],
  'Review': ['Done', 'In Progress'],
  'Done': [],
};

export const ITEMS_PER_PAGE = 20;
export const SEARCH_DEBOUNCE_MS = 300;
