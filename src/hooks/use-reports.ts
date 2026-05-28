import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { ProjectReport, UserReport, ReportOverviewItem } from '@/types';

export function useReportsOverview() {
  return useQuery({
    queryKey: ['reports', 'overview'],
    queryFn: async () => {
      const res = await api.get<ReportOverviewItem[]>('/reports/overview');
      return res.data;
    },
  });
}

export function useProjectReport(projectId: string | undefined) {
  return useQuery({
    queryKey: ['reports', 'project', projectId],
    queryFn: async () => {
      const res = await api.get<ProjectReport>(`/reports/project/${projectId}`);
      return res.data;
    },
    enabled: !!projectId,
  });
}

export function useUserReport(userId: string | undefined) {
  return useQuery({
    queryKey: ['reports', 'user', userId],
    queryFn: async () => {
      const res = await api.get<UserReport>(`/reports/user/${userId}`);
      return res.data;
    },
    enabled: !!userId,
  });
}
