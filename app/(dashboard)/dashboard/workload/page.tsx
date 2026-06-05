import { cookies } from "next/headers";
import {
  getWorkloadMetrics,
  getCurrentWorkspaceRole,
} from "@/lib/services/db";
import { getQueryClient } from "@/lib/query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queries";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { WorkloadClient } from "../../../../components/dashboard/workload-client";

export const metadata: Metadata = {
  title: "Workload",
  description: "Monitor team capacity and task distribution",
};

export default async function WorkloadPage() {
  const role = await getCurrentWorkspaceRole();
  if (role === "USER") {
    redirect("/dashboard/tasks");
  }

  const cookieStore = await cookies();
  const activeWorkspaceId = cookieStore.get("active_workspace")?.value;

  if (!activeWorkspaceId) {
    return <div className="p-6">No workspace selected.</div>;
  }

  const queryClient = getQueryClient();

  // Pre-fetch queries on the server
  await queryClient.prefetchQuery({
    queryKey: queryKeys.workload(activeWorkspaceId),
    queryFn: () => getWorkloadMetrics(activeWorkspaceId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <WorkloadClient workspaceId={activeWorkspaceId} />
    </HydrationBoundary>
  );
}
