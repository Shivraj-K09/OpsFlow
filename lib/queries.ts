import { useQuery } from "@tanstack/react-query";
// Removed direct imports from actions.ts
// Client components will now fetch from /api/...

export const queryKeys = {
  tasks: (workspaceId: string) => ["tasks", workspaceId] as const,
  users: (workspaceId: string) => ["users", workspaceId] as const,
  activity: (workspaceId: string, page: number) =>
    ["activity", workspaceId, page] as const,
  metrics: (workspaceId: string) => ["metrics", workspaceId] as const,
  workload: (workspaceId: string) => ["workload", workspaceId] as const,
};

export function useTasks(workspaceId: string) {
  return useQuery({
    queryKey: queryKeys.tasks(workspaceId),
    queryFn: async () => {
      const res = await fetch(`/api/tasks?workspaceId=${workspaceId}`);
      if (!res.ok) throw new Error("Failed to fetch tasks");
      const json = await res.json();
      return json.data;
    },
    enabled: !!workspaceId,
  });
}

export function useWorkspaceMembers(workspaceId: string) {
  return useQuery({
    queryKey: queryKeys.users(workspaceId),
    queryFn: async () => {
      const res = await fetch(`/api/members?workspaceId=${workspaceId}`);
      if (!res.ok) throw new Error("Failed to fetch members");
      const json = await res.json();
      return json.data;
    },
    enabled: !!workspaceId,
  });
}

export function useActivityLogs(workspaceId: string, page: number = 1) {
  return useQuery({
    queryKey: queryKeys.activity(workspaceId, page),
    queryFn: async () => {
      const res = await fetch(
        `/api/activity?workspaceId=${workspaceId}&page=${page}`,
      );
      if (!res.ok) throw new Error("Failed to fetch activity");
      const json = await res.json();
      return json.data;
    },
    enabled: !!workspaceId,
  });
}

export function useDashboardMetrics(workspaceId: string) {
  return useQuery({
    queryKey: queryKeys.metrics(workspaceId),
    queryFn: async () => {
      const res = await fetch(
        `/api/metrics/dashboard?workspaceId=${workspaceId}`,
      );
      if (!res.ok) throw new Error("Failed to fetch dashboard metrics");
      const json = await res.json();
      return json.data;
    },
    enabled: !!workspaceId,
  });
}

export function useWorkloadMetrics(workspaceId: string) {
  return useQuery({
    queryKey: queryKeys.workload(workspaceId),
    queryFn: async () => {
      const res = await fetch(
        `/api/metrics/workload?workspaceId=${workspaceId}`,
      );
      if (!res.ok) throw new Error("Failed to fetch workload metrics");
      const json = await res.json();
      return json.data;
    },
    enabled: !!workspaceId,
  });
}
