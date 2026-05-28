'use client';

import { useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProjects } from '@/hooks/use-projects';
import { useSprints } from '@/hooks/use-sprints';
import { useTeam } from '@/hooks/use-team';
import type { ProjectListItem, SprintListItem, UserListItem } from '@/types';

interface TaskFiltersProps {
  projectId: string;
  sprintId: string;
  status: string;
  priority: string;
  assignee: string;
  search: string;
  onProjectChange: (val: string) => void;
  onSprintChange: (val: string) => void;
  onStatusChange: (val: string) => void;
  onPriorityChange: (val: string) => void;
  onAssigneeChange: (val: string) => void;
  onSearchChange: (val: string) => void;
}

const statusOptions = [
  { label: 'All Statuses', value: '' },
  { label: 'To Do', value: 'todo' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Review', value: 'review' },
  { label: 'Done', value: 'done' },
];

const priorityOptions = [
  { label: 'All Priorities', value: '' },
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
  { label: 'Critical', value: 'critical' },
];

function safeChange(fn: (val: string) => void) {
  return (val: string | null) => fn(val ?? '');
}

export default function TaskFilters({
  projectId,
  sprintId,
  status,
  priority,
  assignee,
  search,
  onProjectChange,
  onSprintChange,
  onStatusChange,
  onPriorityChange,
  onAssigneeChange,
  onSearchChange,
}: TaskFiltersProps) {
  const { data: projectsData } = useProjects();
  const { data: sprintsData } = useSprints(projectId || '');
  const { data: teamData } = useTeam();

  const projects = useMemo(() => {
    if (!projectsData) return [];
    return Array.isArray(projectsData) ? projectsData : [];
  }, [projectsData]);

  const sprints = useMemo(() => {
    if (!sprintsData) return [];
    return Array.isArray(sprintsData) ? sprintsData : [];
  }, [sprintsData]);

  const teamMembers = useMemo(() => {
    if (!teamData) return [];
    return Array.isArray(teamData) ? teamData : [];
  }, [teamData]);

  return (
    <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
      <div className="relative w-full sm:w-48">
        <Input
          type="search"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full"
        />
      </div>
      <Select value={projectId} onValueChange={safeChange(onProjectChange)}>
        <SelectTrigger className="w-full sm:w-44">
          <span>{projectId ? (projects.find((p: ProjectListItem) => p.id === projectId)?.title || 'Project') : 'All Projects'}</span>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="">All Projects</SelectItem>
            {projects.map((p: ProjectListItem) => (
              <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select value={sprintId} onValueChange={safeChange(onSprintChange)}>
        <SelectTrigger className="w-full sm:w-44">
          <span>{sprintId ? (sprints.find((s: SprintListItem) => s.id === sprintId)?.title || 'Sprint') : 'All Sprints'}</span>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="">All Sprints</SelectItem>
            {sprints.map((s: SprintListItem) => (
              <SelectItem key={s.id} value={s.id}>Sprint {s.sprintNumber}: {s.title}</SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select value={status} onValueChange={safeChange(onStatusChange)}>
        <SelectTrigger className="w-full sm:w-36">
          <span>{status ? statusOptions.find(o => o.value === status)?.label : 'All Statuses'}</span>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {statusOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select value={priority} onValueChange={safeChange(onPriorityChange)}>
        <SelectTrigger className="w-full sm:w-36">
          <span>{priority ? priorityOptions.find(o => o.value === priority)?.label : 'All Priorities'}</span>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {priorityOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select value={assignee} onValueChange={safeChange(onAssigneeChange)}>
        <SelectTrigger className="w-full sm:w-44">
          <span>{assignee ? (teamMembers.find((m: UserListItem) => m.id === assignee)?.name || 'Assignee') : 'All Assignees'}</span>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="">All Assignees</SelectItem>
            {teamMembers.map((m: UserListItem) => (
              <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
