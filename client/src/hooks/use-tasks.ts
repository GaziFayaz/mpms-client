import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import type { TaskListItem, TaskDetail, Subtask, TaskStatus } from '@/types';

export function useTasks(params?: Record<string, string>) {
  return useQuery({
    queryKey: ['tasks', params],
    queryFn: async () => {
      const res = await api.get<TaskListItem[]>('/tasks', { params });
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
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await api.post('/tasks', data);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] });
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
      toast.success('Task updated');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Failed to update task');
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
