import { cookies } from "next/headers";
import { TasksClient } from "@/components/dashboard/tasks-client";
import {
  getWorkspaceMembers,
  getWorkspaceTasks,
  getCurrentWorkspaceRole,
} from "@/lib/services/db";
import { createClient } from "@/lib/supabase/server";
import { getQueryClient } from "@/lib/query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tasks",
  description: "Manage your workspace tasks",
};

export default async function TasksPage() {
  const cookieStore = await cookies();
  const activeWorkspaceId = cookieStore.get("active_workspace")?.value;

  const role = await getCurrentWorkspaceRole();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const queryClient = getQueryClient();

  // Pre-fetch queries on the server
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: queryKeys.tasks(activeWorkspaceId || ""),
      queryFn: () => getWorkspaceTasks(activeWorkspaceId || ""),
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.users(activeWorkspaceId || ""),
      queryFn: () => getWorkspaceMembers(activeWorkspaceId || ""),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TasksClient
        workspaceId={activeWorkspaceId || ""}
        userRole={role || "USER"}
        currentUserId={user?.id || ""}
      />
    </HydrationBoundary>
  );
}
