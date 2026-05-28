import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import type { TaskListItem, TaskDetail, Subtask, TaskStatus, ApiListResponse } from '@/types';

interface TaskListParams {
  project?: string;
  sprint?: string;
  assignee?: string;
  status?: string;
  priority?: string;
  page?: number;
  limit?: number;
}

interface CreateTaskData {
  sprintId: string;
  title: string;
  description?: string;
  priority?: string;
  estimateHours?: number;
  dueDate?: string;
  assigneeIds?: string[];
}

export function useTasks(params?: TaskListParams) {
  return useQuery({
    queryKey: ['tasks', params],
    queryFn: async () => {
      const searchParams: Record<string, string> = {};
      if (params?.project) searchParams.project = params.project;
      if (params?.sprint) searchParams.sprint = params.sprint;
      if (params?.assignee) searchParams.assignee = params.assignee;
      if (params?.status) searchParams.status = params.status;
      if (params?.priority) searchParams.priority = params.priority;
      if (params?.page) searchParams.page = String(params.page);
      if (params?.limit) searchParams.limit = String(params.limit);

      const res = await api.get<ApiListResponse<TaskListItem>>('/tasks', { params: searchParams });
      return res.data;
    },
  });
}

export function useTask(id: string | undefined) {
  return useQuery({
    queryKey: ['tasks', id],
    queryFn: async () => {
      const res = await api.get<TaskDetail>(`/tasks/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateTaskData) => {
      const res = await api.post('/tasks', data);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] });
      qc.invalidateQueries({ queryKey: ['sprints'] });
      toast.success('Task created');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Failed to create task');
    },
  });
}

export function useUpdateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Record<string, unknown>) => {
      const res = await api.put(`/tasks/${id}`, data);
      return res.data;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['tasks'] });
      qc.invalidateQueries({ queryKey: ['tasks', vars.id] });
      qc.invalidateQueries({ queryKey: ['sprints'] });
      toast.success('Task updated');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Failed to update task');
    },
  });
}

export function useDeleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/tasks/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] });
      qc.invalidateQueries({ queryKey: ['sprints'] });
      toast.success('Task deleted');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Failed to delete task');
    },
  });
}

export function useUpdateTaskStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: TaskStatus }) => {
      const res = await api.patch(`/tasks/${id}/status`, { status });
      return res.data;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['tasks'] });
      qc.invalidateQueries({ queryKey: ['tasks', vars.id] });
      toast.success('Status updated');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Failed to update status');
    },
  });
}

export function useUpdateKanbanOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, sortOrder, status }: { id: string; sortOrder: number; status: TaskStatus }) => {
      const res = await api.patch(`/tasks/${id}/kanban-order`, { sortOrder, status });
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Failed to reorder');
    },
  });
}

export function useAddSubtask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ taskId, title }: { taskId: string; title: string }) => {
      const res = await api.post<Subtask>(`/tasks/${taskId}/subtasks`, { title });
      return res.data;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['tasks', vars.taskId] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Failed to add subtask');
    },
  });
}

export function useToggleSubtask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ taskId, subtaskId, completed }: { taskId: string; subtaskId: string; completed: boolean }) => {
      const res = await api.patch(`/tasks/${taskId}/subtasks/${subtaskId}`, { completed });
      return res.data;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['tasks', vars.taskId] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Failed to toggle subtask');
    },
  });
}

export function useTaskComments(taskId: string | undefined) {
  return useQuery({
    queryKey: ['tasks', taskId, 'comments'],
    queryFn: async () => {
      const res = await api.get(`/tasks/${taskId}/comments`);
      return res.data;
    },
    enabled: !!taskId,
  });
}

export function useAddComment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ taskId, body, parentId }: { taskId: string; body: string; parentId?: string }) => {
      const res = await api.post(`/tasks/${taskId}/comments`, { body, parentId });
      return res.data;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['tasks', vars.taskId, 'comments'] });
      qc.invalidateQueries({ queryKey: ['tasks', vars.taskId] });
      toast.success('Comment added');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Failed to add comment');
    },
  });
}

export function useTimeLogs(taskId: string | undefined) {
  return useQuery({
    queryKey: ['tasks', taskId, 'timelogs'],
    queryFn: async () => {
      const res = await api.get(`/tasks/${taskId}/timelogs`);
      return res.data;
    },
    enabled: !!taskId,
  });
}

export function useAddTimeLog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ taskId, hours, description, loggedDate }: { taskId: string; hours: number; description?: string; loggedDate: string }) => {
      const res = await api.post(`/tasks/${taskId}/timelogs`, { hours, description, loggedDate });
      return res.data;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['tasks', vars.taskId, 'timelogs'] });
      toast.success('Time logged');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Failed to log time');
    },
  });
}

export function useUploadAttachment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ taskId, file }: { taskId: string; file: File }) => {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post(`/tasks/${taskId}/attachments`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['tasks', vars.taskId] });
      toast.success('Attachment uploaded');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Failed to upload attachment');
    },
  });
}

export function useDeleteAttachment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ attachmentId, taskId }: { attachmentId: string; taskId: string }) => {
      await api.delete(`/attachments/${attachmentId}`);
      return taskId;
    },
    onSuccess: (taskId) => {
      qc.invalidateQueries({ queryKey: ['tasks', taskId] });
      toast.success('Attachment deleted');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Failed to delete attachment');
    },
  });
}
