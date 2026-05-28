import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import type { UserListItem } from '@/types';

export function useTeam() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await api.get<UserListItem[]>('/users');
      return res.data;
    },
  });
}

export function useCreateMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await api.post('/users', data);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      toast.success('Member added');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Failed to add member');
    },
  });
}

export function useUpdateMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Record<string, unknown>) => {
      const res = await api.put(`/users/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      toast.success('Member updated');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Failed to update member');
    },
  });
}

export function useDeleteMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/users/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      toast.success('Member removed');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Failed to remove member');
    },
  });
}
