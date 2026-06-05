import { cookies } from "next/headers";
import { getActivityLogs } from "@/lib/services/db";
import { getQueryClient } from "@/lib/query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queries";
import type { Metadata } from "next";
import { ActivityClient } from "@/components/dashboard/activity-client";

export const metadata: Metadata = {
  title: "Activity Logs",
  description: "Immutable audit trail of all workspace actions",
};

export default async function ActivityPage() {
  const cookieStore = await cookies();
  const activeWorkspaceId = cookieStore.get("active_workspace")?.value;

  const queryClient = getQueryClient();

  // Pre-fetch queries on the server
  await queryClient.prefetchQuery({
    queryKey: queryKeys.activity(activeWorkspaceId || "", 1),
    queryFn: () => getActivityLogs(activeWorkspaceId || "", 1),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ActivityClient workspaceId={activeWorkspaceId || ""} />
    </HydrationBoundary>
  );
}
