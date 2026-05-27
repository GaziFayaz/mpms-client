import type { TaskStatus, Priority, ProjectStatus, UserRole } from '@/lib/constants';

export type { TaskStatus, Priority, ProjectStatus, UserRole };

export interface ApiError {
  error: string;
  status: number;
  details?: { field: string; message: string }[];
  stack?: string;
}

export interface ApiListResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string | null;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
  refreshToken: string;
}

export interface RefreshResponse {
  token: string;
  refreshToken: string;
}

export interface UserProfile extends AuthUser {
  department: string | null;
  skills: string[];
}

export interface UserListItem {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string | null;
  skills: string[];
  avatarUrl: string | null;
  createdAt: string;
}

export interface Assignee {
  id: string;
  name: string;
  avatarUrl: string | null;
}

export interface ProjectStats {
  total_tasks: number;
  completed_tasks: number;
  progress_percent: number;
}

export interface ProjectListItem {
  id: string;
  title: string;
  client: string;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  budget: string | null;
  thumbnailUrl: string | null;
  stats: ProjectStats;
}

export interface SprintListItem {
  id: string;
  projectId: string;
  title: string;
  sprintNumber: number;
  startDate: string;
  endDate: string;
  sortOrder: number;
  stats: ProjectStats;
}

export interface ProjectDetail extends ProjectListItem {
  description: string | null;
  sprints: SprintListItem[];
  createdAt: string;
  updatedAt: string;
}

export interface SubtaskStats {
  total: number;
  completed: number;
}

export interface TaskListItem {
  id: string;
  projectId: string;
  projectTitle: string;
  sprintId: string | null;
  sprintTitle: string | null;
  title: string;
  status: TaskStatus;
  priority: Priority;
  estimateHours: string | null;
  dueDate: string | null;
  assignees: Assignee[];
  subtasksStats: SubtaskStats;
  sortOrder: number;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  sortOrder: number;
}

export interface CommentItem {
  id: string;
  userId: string;
  userName: string;
  userAvatarUrl: string | null;
  parentId: string | null;
  body: string;
  createdAt: string;
  replies: CommentItem[];
}

export interface ActivityItem {
  id: string;
  userId: string;
  userName: string;
  action: 'created' | 'updated_status' | 'assigned' | 'commented' | 'attached_file' | 'subtask_toggled';
  details: Record<string, unknown>;
  createdAt: string;
}

export interface TaskDetail extends TaskListItem {
  description: string | null;
  subtasks: Subtask[];
  comments: CommentItem[];
  activityLog: ActivityItem[];
  attachments?: Attachment[];
  createdAt: string;
  updatedAt: string;
}

export interface SprintDetail extends SprintListItem {
  tasks: TaskListItem[];
}

export interface Attachment {
  id: string;
  taskId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedBy: string;
  createdAt: string;
}

export interface TimeLog {
  id: string;
  taskId: string;
  userId: string;
  hours: number;
  description: string | null;
  loggedDate: string;
  createdAt: string;
}

export interface ProjectReport {
  project: { id: string; title: string; status: ProjectStatus };
  total_tasks: number;
  completed_tasks: number;
  progress_percent: number;
  total_hours_logged: number;
  tasks_by_status: { status: TaskStatus; count: number }[];
  tasks_by_sprint: { sprint_id: string; sprint_title: string; total: number; completed: number }[];
}

export interface UserReport {
  user: { id: string; name: string };
  assigned_tasks: number;
  completed_tasks: number;
  total_hours_logged: number;
  tasks_by_status: { status: TaskStatus; count: number }[];
  projects_involved: { id: string; title: string; task_count: number }[];
}

export interface ReportOverviewItem {
  id: string;
  title: string;
  client: string;
  status: ProjectStatus;
  total_tasks: number;
  completed_tasks: number;
  progress_percent: number;
}
