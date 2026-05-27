import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import type { SprintListItem, SprintDetail, TaskListItem } from '@/types';

export function useSprints(projectId: string | undefined) {
  return useQuery({
    queryKey: ['sprints', projectId],
    queryFn: async () => {
      const res = await api.get<SprintListItem[]>(`/projects/${projectId}/sprints`);
      return res.data;
    },
    enabled: !!projectId,
  });
}

export function useSprint(id: string | undefined) {
  return useQuery({
    queryKey: ['sprints', id],
    queryFn: async () => {
      const res = await api.get<SprintDetail>(`/sprints/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useSprintTasks(sprintId: string | undefined) {
  return useQuery({
    queryKey: ['sprints', sprintId, 'tasks'],
    queryFn: async () => {
      const res = await api.get<TaskListItem[]>(`/sprints/${sprintId}/tasks`);
      return res.data;
    },
    enabled: !!sprintId,
  });
}

export function useCreateSprint() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { projectId: string; title: string; startDate: string; endDate: string }) => {
      const res = await api.post('/sprints', data);
      return res.data;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['sprints', vars.projectId] });
      qc.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Sprint created');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Failed to create sprint');
    },
  });
}

export function useUpdateSprint() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string; projectId: string } & Record<string, unknown>) => {
      const res = await api.put(`/sprints/${id}`, data);
      return res.data;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['sprints'] });
      qc.invalidateQueries({ queryKey: ['projects', vars.projectId] });
      toast.success('Sprint updated');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Failed to update sprint');
    },
  });
}

export function useDeleteSprint() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, projectId }: { id: string; projectId: string }) => {
      await api.delete(`/sprints/${id}`);
      return projectId;
    },
    onSuccess: (projectId) => {
      qc.invalidateQueries({ queryKey: ['sprints'] });
      qc.invalidateQueries({ queryKey: ['projects', projectId] });
      toast.success('Sprint deleted');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Failed to delete sprint');
    },
  });
}

export function useReorderSprint() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, sortOrder, projectId }: { id: string; sortOrder: number; projectId: string }) => {
      await api.patch(`/sprints/${id}/order`, { sortOrder });
      return projectId;
    },
    onSuccess: (projectId) => {
      qc.invalidateQueries({ queryKey: ['sprints'] });
      qc.invalidateQueries({ queryKey: ['projects', projectId] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Failed to reorder sprint');
    },
  });
}
